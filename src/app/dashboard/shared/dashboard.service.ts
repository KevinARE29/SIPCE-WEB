import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getDashboard(): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}reporting/dashboard`).pipe(
      map((response) => {
        const page = {
          activeUsers: response['activeUsers'],
          totalStudents: response['totalStudents'],
          usersByRole: [],
          studentsByStatus: [],
          studentsByCurrentShiftAndGrade: [],
          studentsByCurrentShift: []
        };

        console.log(response);
        return page;
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
      // error.error.message = this.errorMessageService.transformMessage('dashboard', error.error.message);
      return throwError(error.error);
    };
  }
}
