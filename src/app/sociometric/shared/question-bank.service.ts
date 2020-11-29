import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/operators';

import { ErrorMessageService } from 'src/app/shared/error-message.service';

import { environment } from 'src/environments/environment';
import { QuestionBank } from './question-bank.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionBankService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  createQuestionsBank(questionBank: QuestionBank): Observable<QuestionBank> {
    return this.http
      .post<QuestionBank>(`${this.baseUrl}sociometrics/question-banks`, JSON.stringify(questionBank))
      .pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('questionsBank', error.error.message);
      return throwError(error.error);
    };
  }
}
