import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from '../../shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  deletePeriod(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}academics/periods/${id}`).pipe(catchError(this.handleError()));
  }

  getPeriod(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}academics/periods`).pipe(catchError(this.handleError()));
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
