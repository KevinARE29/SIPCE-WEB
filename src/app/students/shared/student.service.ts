import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { getYear, differenceInYears, getDate } from 'date-fns';

import { Student } from './student.model';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { ResponsibleService } from './responsible.service';
import { Grade } from 'src/app/shared/grade.model';
import { Responsible } from './responsible.model';
import { GradeService } from 'src/app/manage-academic-catalogs/shared/grade.service';
import { ShiftService } from 'src/app/manage-academic-catalogs/shared/shift.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    private gradeService: GradeService,
    private shiftService: ShiftService
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

    return this.http.get<Student[]>(url).pipe(catchError(this.handleError()));
  }

  bulkStudents(students: any, shift: number, currentYear: boolean): Observable<any> {
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

    return this.http.post<any>(`${this.baseUrl}students/bulk`, data).pipe(catchError(this.handleError()));
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
        student.age = differenceInYears(new Date(student.birthdate), today);
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

        student.responsibles = new Array<Responsible>();
        student.images = new Array<unknown>();

        result['data'].images.forEach((img) => {
          const url = img['path'].split('/');
          const grade = url[url.length - 1];
          const gradeName = grade.split('.');

          student.images.push({ id: img['id'], title: gradeName[0], image: img['path'] });
        });

        result['data'].responsibleStudents.forEach((responsible) => {
          const studentResponsible = new Responsible();

          studentResponsible.id = responsible['responsible'].id;
          studentResponsible.email = responsible['responsible'].email;
          studentResponsible.firstname = responsible['responsible'].firstname;
          studentResponsible.lastname = responsible['responsible'].lastname;
          studentResponsible.phone = responsible['responsible'].phone;
          studentResponsible.relationship = responsible['relationship'];

          student.responsibles.push(studentResponsible);
        });

        return student;
      })
    );
  }

  mergeStudentAndCatalogs(id: number): Observable<unknown> {
    return forkJoin({
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
