import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  baseUrl: string;
  errorMessageService: any;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiURL;
  }

  bulkStudents(students: any, shift: number): Observable<any> {
    const newStudents = new Array<any>();

    students.forEach((element) => {
      if (element.registrationYear && element.startedGrade) {
        newStudents.push({
          gradeId: element.grade.grade.id,
          startedGradeId: element.startedGrade.grade.id,
          registrationYear: element.registrationYear.value,
          code: element.code.value,
          firstname: element.firstname.value,
          lastname: element.lastname.value,
          email: element.email.value,
          birthdate: element.birthdate.value,
          responsibleFirstname: element.responsibleFirstname.value,
          responsibleLastname: element.responsibleLastname.value,
          responsibleRelationship: element.responsibleRelationship.value,
          responsibleEmail: element.responsibleEmail.value,
          responsiblePhone: element.responsiblePhone.value
        });
      } else {
        newStudents.push({
          gradeId: element.grade.grade.id,
          code: element.code.value,
          firstname: element.firstname.value,
          lastname: element.lastname.value,
          email: element.email.value,
          birthdate: element.birthdate.value,
          responsibleFirstname: element.responsibleFirstname.value,
          responsibleLastname: element.responsibleLastname.value,
          responsibleRelationship: element.responsibleRelationship.value,
          responsibleEmail: element.responsibleEmail.value,
          responsiblePhone: element.responsiblePhone.value
        });
      }
    });
    console.log(newStudents);
    const data = JSON.stringify({
      shiftId: shift,
      students: newStudents
    });

    return this.http.post<any>(`${this.baseUrl}students/bulk`, data).pipe(catchError(this.handleError()));
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
