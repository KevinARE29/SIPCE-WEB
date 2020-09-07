import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { Student } from '../../students/shared/student.model';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { User } from 'src/app/users/shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getUser(username: string): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}users?paginate=false&username=${username}`)
      .pipe(catchError(this.handleError()));
  }

  createAppointment(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}schedules/me`, data).pipe(catchError(this.handleError()));
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('students', error.error.message);
      return throwError(error.error);
    };
  }
}
