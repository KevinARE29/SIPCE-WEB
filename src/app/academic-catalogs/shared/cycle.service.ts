import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorMessageService } from '../../shared/error-message.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ShiftPeriodGrade } from './shiftPeriodGrade.model';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  updateCycle(cycle: unknown): Observable<void> {
    return this.http
      .put<void>(`${this.baseUrl}academics/cycles/${cycle['id']}`, JSON.stringify({ name: cycle['name'] }))
      .pipe(catchError(this.handleError()));
  }

  deleteCycle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}academics/cycles/${id}`).pipe(catchError(this.handleError()));
  }

  createCycle(name: string): Observable<ShiftPeriodGrade> {
    return this.http
      .post<ShiftPeriodGrade>(`${this.baseUrl}academics/cycles`, JSON.stringify(name))
      .pipe(catchError(this.handleError()));
  }

  searchCycle(params: NzTableQueryParams, paginate: boolean): Observable<ShiftPeriodGrade[]> {
    let url = this.baseUrl + 'academics/cycles';
    let queryParams = '';

    if (paginate) queryParams += '?page=' + params.pageIndex;

    if (params) {
      if (params.sort[0].value) {
        queryParams += '&sort=' + params.sort[0].key;
        switch (params.sort[0].value) {
          case 'ascend':
            queryParams += '-' + params.sort[0].value.substring(0, 3);
            break;
          case 'descend':
            queryParams += '-' + params.sort[0].value.substring(0, 4);
            break;
        }
      }
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');
    url += queryParams;

    return this.http.get<ShiftPeriodGrade[]>(url).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('catalogs', error.error.message);
      return throwError(error.error);
    };
  }
}
