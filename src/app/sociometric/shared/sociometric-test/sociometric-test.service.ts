import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { SociometricTest } from './sociometric-test.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SociometricTestService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  createSociometricTest(sociometricTest: SociometricTest): Observable<SociometricTest> {
    const data = JSON.stringify({
      shiftId: sociometricTest.shift.id,
      gradeId: sociometricTest.grade.id,
      sectionId: sociometricTest.section.id,
      questionBankId: sociometricTest.questionBank.id,
      answersPerQuestion: sociometricTest.answersPerQuestion
    });

    return this.http
      .post<SociometricTest>(`${this.baseUrl}sociometric/tests`, data)
      .pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('sociometric-tests', error.error.message);
      return throwError(error.error);
    };
  }
}
