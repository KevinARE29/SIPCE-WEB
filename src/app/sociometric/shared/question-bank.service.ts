import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { QuestionBank } from './question-bank.model';
import { UserService } from 'src/app/users/shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionBankService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    private userService: UserService
  ) {
    this.baseUrl = environment.apiURL;
  }

  createQuestionsBank(questionBank: QuestionBank): Observable<QuestionBank> {
    return this.http
      .post<QuestionBank>(`${this.baseUrl}sociometric/question-banks`, JSON.stringify(questionBank))
      .pipe(catchError(this.handleError()));
  }

  getQuestionBanks(params: NzTableQueryParams, search: string, paginate: boolean): Observable<QuestionBank[]> {
    let url = this.baseUrl + 'sociometric/question-banks';
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

    if (search) queryParams += '&name=' + search;
    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<QuestionBank[]>(url).pipe(catchError(this.handleError()));
  }

  getAllQuestionBanks(): Observable<QuestionBank[]> {
    return this.http
      .get<QuestionBank[]>(`${this.baseUrl}sociometric/question-banks?paginate=false`)
      .pipe(catchError(this.handleError()));
  }

  getQuestionBank(id: number): Observable<QuestionBank> {
    return this.http
      .get<QuestionBank>(`${this.baseUrl}sociometric/question-banks/${id}`)
      .pipe(catchError(this.handleError()));
  }

  updateQuestionBank(questionBank: QuestionBank): Observable<QuestionBank> {
    return this.http
      .put<QuestionBank>(`${this.baseUrl}sociometric/question-banks/${questionBank.id}`, JSON.stringify(questionBank))
      .pipe(catchError(this.handleError()));
  }

  deleteQuestionBank(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}sociometric/question-banks/${id}`)
      .pipe(catchError(this.handleError()));
  }

  mergeQuestionBanksAndCatalogs(): Observable<unknown> {
    return forkJoin({
      profile: this.userService.getUserProfile(),
      questionBanks: this.getAllQuestionBanks()
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('question-banks', error.error.message);
      return throwError(error.error);
    };
  }
}
