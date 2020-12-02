import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { SociometricTest } from './sociometric-test.model';


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

  getSociometricTests(params: NzTableQueryParams, search: unknown, paginate: boolean): Observable<SociometricTest[]> {
    let url = this.baseUrl + 'sociometric/tests';
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
      if (search['shiftId']) queryParams += '&shift=' + search['shiftId'];

      if (search['gradeId']) queryParams += '&grade=' + search['gradeId'];

      if (search['sectionId']) queryParams += '&section=' + search['sectionId'];

      if (search['status']) queryParams += '&status=' + search['status'];

      // queryParams += '&historical=' + !search['current'];
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<SociometricTest[]>(url).pipe(catchError(this.handleError()));
  }

  deleteSociometricTest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}sociometric/tests/${id}`).pipe(catchError(this.handleError()));
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
