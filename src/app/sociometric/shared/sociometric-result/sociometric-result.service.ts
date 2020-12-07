import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { GrupalResult } from './grupal-result.model';
import { SociometricValues } from './sociometric-values.model';
import { IndividualResult } from './individual-result.model';

@Injectable({
  providedIn: 'root'
})
export class SociometricResultService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getQuestionGrupalResult(testId: number, questionId: number): Observable<GrupalResult> {
    const url = this.baseUrl + 'sociometric/tests/' + testId + '/questions/' + questionId;

    return this.http.get(url).pipe(
      map((r) => {
        const data: GrupalResult = r['data'];

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
    return this.getQuestionGrupalResult(testId, questionId).pipe(
      map((grupalResult: GrupalResult) => {
        const index = grupalResult.individualIndexes.findIndex((result) => result.student.id === studentId);

        const individualResult = new IndividualResult();
        individualResult.individualIndex = grupalResult.individualIndexes[index];
        individualResult.answer = grupalResult.answersPerStudent[index];

        return individualResult;
      })
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
