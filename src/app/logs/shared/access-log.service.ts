import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { subMonths } from 'date-fns';
import { environment } from './../../../environments/environment';
import { ErrorMessageService } from '../../shared/error-message.service';
import { AccessLog } from './access-log.model';
import { AccessLogComponent } from '../components/access-log/access-log.component';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getAccessLog(currentDate: any): Observable<AccessLog[]> {
    let url = this.baseUrl + 'logs/access-logs';
    var date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    
    let queryParams = '?attemptTimeStart='+ date.toISOString() + '&attemptTimeEnd=' + currentDate.toISOString();

    url += queryParams;
    return this.http.get<AccessLog[]>(url)
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
      error.error.message = this.errorMessageService.transformMessage("access-log", error.error.message);
      return throwError(error.error);
    };
  }
}
