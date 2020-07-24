import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorMessageService } from 'src/app/shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
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

    const jsonData = JSON.stringify(data);
    return this.http.post<any>(`${this.baseUrl}students/bulk`, jsonData).pipe(catchError(this.handleError()));
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
