import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { differenceInMonths, differenceInYears, getYear } from 'date-fns';

import { Student } from './student.model';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Responsible } from './responsible.model';
import { GradeService } from 'src/app/academic-catalogs/shared/grade.service';
import { ShiftService } from 'src/app/academic-catalogs/shared/shift.service';
import { SectionService } from 'src/app/academic-catalogs/shared/section.service';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    private gradeService: GradeService,
    private shiftService: ShiftService,
    private sectionService: SectionService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getStudents(
    params: NzTableQueryParams,
    search: Student,
    isActive: boolean,
    paginate: boolean
  ): Observable<Student[]> {
    let url = this.baseUrl + 'students';
    let queryParams = '';

    // Paginate?
    if (paginate) queryParams += '?page=' + params.pageIndex;

    // Params
    if (params) {
      let sort = '&sort=';
      params.sort.forEach((param) => {
        if (param.value) {
          sort += param.key;
          switch (param.value) {
            case 'ascend':
              sort += '-' + param.value.substring(0, 3) + ',';
              break;
            case 'descend':
              sort += '-' + param.value.substring(0, 4) + ',';
              break;
          }
        }
      });

      if (sort.length > 6) {
        if (sort.charAt(sort.length - 1) === ',') sort = sort.slice(0, -1);

        queryParams += sort;
      }
    }

    if (search) {
      if (search.code) queryParams += '&code=' + search.code;

      if (search.firstname) queryParams += '&firstname=' + search.firstname;

      if (search.lastname) queryParams += '&lastname=' + search.lastname;

      if (search.email) queryParams += '&email=' + search.email;

      if (search.grade && search.grade.id) queryParams += '&currentGrade=' + search.grade.id;

      if (search.status) queryParams += '&status=' + search.status;

      queryParams += '&active=' + isActive;
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<Student[]>(url).pipe(
      map((response) => {
        response['data'].forEach((student) => {
          const months = differenceInMonths(new Date(), new Date(student.createdAt));
          const years = differenceInYears(new Date(), new Date(student.createdAt));

          student.canBeDeleted = student.status === 'Egresado' || months < 3 || years > 15;
        });

        return response;
      }),
      catchError(this.handleError())
    );
  }

  bulkStudents(students: any, shift: number, currentYear: boolean): Observable<unknown> {
    const newStudents = new Array<any>();
    const data = {};
    students.forEach((element) => {
      const newProperty = {};

      newProperty['gradeId'] = element.grade.grade.id;
      newProperty['code'] = element.code.value;
      newProperty['firstname'] = element.firstname.value;
      newProperty['lastname'] = element.lastname.value;
      newProperty['email'] = element.email.value;
      newProperty['birthdate'] = element.birthdate.value;
      newProperty['responsibleFirstname'] = element.responsibleFirstname.value;
      newProperty['responsibleLastname'] = element.responsibleLastname.value;
      newProperty['responsibleRelationship'] = element.responsibleRelationship.value;
      newProperty['responsibleEmail'] = element.responsibleEmail.value;
      newProperty['responsiblePhone'] = element.responsiblePhone.value.replace('-', '');

      if (element.registrationYear && element.startedGrade) {
        newProperty['startedGradeId'] = element.startedGrade.grade.id;
        newProperty['registrationYear'] = Number(element.registrationYear.value);
      }
      newStudents.push(newProperty);
    });

    data['shiftId'] = shift;
    data['students'] = newStudents;
    if (Object.keys(newStudents[0]).length === 11) data['currentYear'] = currentYear;

    const jsonData = JSON.stringify(data);
    return this.http.post<any>(`${this.baseUrl}students/bulk`, jsonData).pipe(catchError(this.handleError()));
  }

  createStudent(student: Student): Observable<Student> {
    const data = {};
    data['responsible'] = {};

    data['responsible'].relationship = student.responsibles[0].relationship;
    data['responsible'].firstname = student.responsibles[0].firstname;
    data['responsible'].lastname = student.responsibles[0].lastname;
    data['responsible'].email = student.responsibles[0].email;
    data['responsible'].phone = student.responsibles[0].phone.replace('-', '');
    data['code'] = student.code;
    data['firstname'] = student.firstname;
    data['lastname'] = student.lastname;
    data['email'] = student.email;
    data['birthdate'] = student.birthdate;
    data['shiftId'] = student.shift.id;
    data['gradeId'] = student.grade.id;

    if (student.startedGrade.id) data['startedGradeId'] = student.startedGrade.id;
    if (student.registrationYear) data['registrationYear'] = getYear(student.registrationYear);

    return this.http
      .post<Student>(`${this.baseUrl}students`, JSON.stringify(data))
      .pipe(catchError(this.handleError()));
  }

  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}students/${id}`).pipe(
      map((result) => {
        const student = new Student();
        const today = new Date();
        const detailsLast = result['data'].sectionDetails.length - 1;

        student.id = result['data'].id;
        student.code = result['data'].code;
        student.firstname = result['data'].firstname;
        student.lastname = result['data'].lastname;
        student.email = result['data'].email;
        student.birthdate = result['data'].birthdate;
        student.age = differenceInYears(today, new Date(student.birthdate));
        student.status = result['data'].status;
        student.shift = result['data'].currentShift;
        student.cycle = result['data'].sectionDetails[detailsLast]
          ? result['data'].sectionDetails[detailsLast].gradeDetail.cycleDetail.cycle
          : null;
        student.grade = result['data'].currentGrade;
        student.section = result['data'].sectionDetails[detailsLast]
          ? result['data'].sectionDetails[detailsLast].section
          : null;
        student.startedGrade = result['data'].startedGrade;
        student.siblings = result['data'].siblings;
        student.registrationYear = result['data'].registrationYear;
        student.currentPhoto = result['data'].currentPhoto;

        student.responsibles = new Array<Responsible>();
        student.images = new Array<unknown>();

        result['data'].images.forEach((img) => {
          const url = img['path'].split('/');
          const grade = url[url.length - 1];
          const gradeName = grade.split('.');

          student.images.push({ id: img['id'], title: gradeName[0], image: img['path'] });
        });

        result['data'].responsibleStudents.forEach((responsible) => {
          if (responsible.responsible.id) {
            const studentResponsible = new Responsible();
            const phone = responsible['responsible'].phone;

            studentResponsible.id = responsible['responsible'].id;
            studentResponsible.email = responsible['responsible'].email;
            studentResponsible.firstname = responsible['responsible'].firstname;
            studentResponsible.lastname = responsible['responsible'].lastname;
            studentResponsible.relationship = responsible['relationship'];
            studentResponsible.phone = phone.substring(0, 4).concat('-', phone.substring(4, 8));

            student.responsibles.push(studentResponsible);
          }
        });

        return student;
      })
    );
  }

  updateStudent(student: Student): Observable<Student> {
    const data = {};
    const siblingsIds = new Array<number>();

    if (student.siblings) {
      data['siblings'] = siblingsIds;
      student.siblings.forEach((sibling) => {
        siblingsIds.push(sibling.id);
      });
    }

    if (student.status) data['status'] = student.status;
    if (student.firstname) data['firstname'] = student.firstname;
    if (student.lastname) data['lastname'] = student.lastname;
    if (student.email) data['email'] = student.email;
    if (student.birthdate) data['birthdate'] = student.birthdate;
    if (student.shift) data['shiftId'] = student.shift.id;
    if (student.grade) data['gradeId'] = student.grade.id;
    if (student.section) data['sectionId'] = student.section ? student.section.id : null;
    if (student.startedGrade) data['startedGradeId'] = student.startedGrade.id;
    if (student.registrationYear) data['registrationYear'] = getYear(student.registrationYear);

    return this.http
      .put<Student>(`${this.baseUrl}students/${student.id}`, JSON.stringify(data))
      .pipe(catchError(this.handleError()));
  }

  deleteStudent(studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}students/${studentId}`);
  }

  getStudentsAssignation(shiftId: number, gradeId: number): Observable<unknown> {
    return this.http
      .get<unknown>(`${this.baseUrl}students-assignation?currentGradeId=${gradeId}&currentShiftId=${shiftId}`)
      .pipe(
        map((response) => {
          const myStudents = new Array<unknown>();
          let assignedStudents = new Array<unknown>();
          const studentsWithoutAssignation = new Array<unknown>();
          let availableSections = new Array<ShiftPeriodGrade>();

          for (let i = 0; i < response['assignedStudents'].length; i++) {
            const student = response['assignedStudents'][i];
            const section = availableSections.find((x) => x.id === student.section.id);

            if (!section) availableSections.push(student.section);
            assignedStudents[i] = { student, disabled: false };
          }

          for (let i = 0; i < response['studentsWithoutAssignation'].length; i++) {
            studentsWithoutAssignation[i] = { student: response['studentsWithoutAssignation'][i], disabled: false };
          }

          for (let i = 0; i < response['myStudents'].length; i++) {
            myStudents[i] = { student: response['myStudents'][i], disabled: false };
          }

          availableSections = availableSections.sort((a, b) => a.id - b.id);
          assignedStudents = assignedStudents.sort((a, b) => a['student'].section.id - b['student'].section.id);

          return { assignedStudents, studentsWithoutAssignation, myStudents, availableSections };
        }),
        catchError(this.handleError())
      );
  }

  updateStudentsAssignation(
    shiftId: number,
    gradeId: number,
    students: number[],
    vinculate: boolean
  ): Observable<unknown> {
    const data = JSON.stringify({ studentIds: students, vinculate });
    return this.http
      .patch<unknown>(`${this.baseUrl}students-assignation?currentGradeId=${gradeId}&currentShiftId=${shiftId}`, data)
      .pipe(catchError(this.handleError()));
  }

  mergeStudentAndCatalogs(id: number): Observable<unknown> {
    return forkJoin({
      sections: this.sectionService.getAllSections(),
      grades: this.gradeService.getAllGrades(),
      shifts: this.shiftService.getShifts(),
      student: this.getStudent(id)
    });
  }

  createOrUpdatePicture(studentId: number, grade: number, image: Blob): Observable<any> {
    const fd = new FormData();
    fd.append('image', image, image['name']);

    return this.http.post<string>(`${this.baseUrl}students/${studentId}/images?gradeId=${grade}`, fd);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('students', error.error.message);
      return throwError(error.error);
    };
  }
}
