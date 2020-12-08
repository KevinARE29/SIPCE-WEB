import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { environment } from 'src/environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { GroupalResult } from './groupal-result.model';
import { SociometricValues } from './sociometric-values.model';
import { IndividualResult } from './individual-result.model';
import { SociometricResult } from './sociometric-result.model';
import { QuestionBank } from '../question-bank.model';

@Injectable({
  providedIn: 'root'
})
export class SociometricResultService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getQuestionGroupalResult(testId: number, questionId: number): Observable<GroupalResult> {
    const url = this.baseUrl + 'sociometric/tests/' + testId + '/questions/' + questionId;

    return this.http.get(url).pipe(
      map((r) => {
        const data: GroupalResult = r['data'];

        data.individualIndexes.forEach((individual, index) => {
          individual.sociometricValues = new SociometricValues();
          individual.sociometricValues.sp = data.sociometricValues.spArray[index];
          individual.sociometricValues.sn = data.sociometricValues.snArray[index];
          individual.sociometricValues.spVal = data.sociometricValues.spValArray[index];
          individual.sociometricValues.snVal = data.sociometricValues.snValArray[index];
          individual.sociometricValues.ep = data.sociometricValues.epArray[index];
          individual.sociometricValues.en = data.sociometricValues.enArray[index];
          individual.sociometricValues.rp = data.sociometricValues.rpArray[index];
          individual.sociometricValues.rn = data.sociometricValues.rnArray[index];
        });

        return data;
      }),
      catchError(this.handleError())
    );
  }

  getQuestionIndividualResult(testId: number, questionId: number, studentId: number): Observable<IndividualResult> {
    return this.getQuestionGroupalResult(testId, questionId).pipe(
      map((groupalResult: GroupalResult) => {
        const index = groupalResult.individualIndexes.findIndex((result) => result.student.id === studentId);

        const individualResult = new IndividualResult();
        individualResult.individualIndex = groupalResult.individualIndexes[index];
        individualResult.answer = groupalResult.answersPerStudent[index];

        return individualResult;
      })
    );
  }

  exportSociometricTest(testId: number, token: string, filters: string[]): Observable<SociometricResult> {
    const url = this.baseUrl + 'reporting/tests/' + testId + '?token=' + token + '&filter=' + filters.join(',');

    return this.http.get<SociometricResult>(url).pipe(
      map((r) => {
        const data: SociometricResult = r['data'];
        data.date = format(new Date(), 'd/MMMM/yyyy', { locale: es });

        // Fix: when there is not questionBank but there is groupal data.
        if (!data.questionBank && data.generalReports) {
          data.questionBank = new QuestionBank();
          data.questionBank.questions = data.individualReports
            ? data.individualReports[0].questions.map((q) => q.question)
            : [];
        }

        return data;
      }),
      catchError(this.handleError())
    );
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
