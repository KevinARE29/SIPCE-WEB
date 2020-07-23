import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from '../../shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getGrades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}academics/grades?paginate=false`).pipe(catchError(this.handleError()));
  }

  searchGrade(params: NzTableQueryParams, paginate: boolean): Observable<any[]> {
    let url = this.baseUrl + 'academics/grades';
    let queryParams = '';

    if (paginate) queryParams += '?page=' + params.pageIndex;
    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<any[]>(url).pipe(catchError(this.handleError()));
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}academics/grades/${id}`).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('ShiftPeriodGrades', error.error.message);
      return throwError(error.error);
    };
  }
}
