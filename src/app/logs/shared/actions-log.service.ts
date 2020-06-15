import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { subMonths } from 'date-fns';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from '../../shared/error-message.service';
import { ActionLog } from './action-log.model';

@Injectable({
  providedIn: 'root'
})
export class ActionsLogService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getActionsLog(currentDate: any): Observable<ActionLog[]> {
    let url = this.baseUrl + 'logs/action-logs';
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    
    let queryParams = '?attemptTimeStart='+ date.toISOString() + '&attemptTimeEnd=' + currentDate.toISOString();

    url += queryParams;
    return this.http.get<ActionLog[]>(url)
      .pipe(
        catchError(this.handleError())
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage("actions-log", error.error.message);
      return throwError(error.error);
    };
  }
}
