/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  // TODO: Create administratives
  createAdministratives(administratives: any): Observable<any> {
    const users = new Array<any>();

    administratives.forEach((element) => {
      users.push({
        code: element.code.value,
        firstname: element['firstname'].value,
        lastname: element['lastname'].value,
        email: element['email'].value,
        role: element['role'].value,
        username: element['username'].value
      });
    });

    const data = JSON.stringify({
      administratives: users
    });

    return this.http.post<any>(`${this.baseUrl}users/administratives`, data).pipe(catchError(this.handleError()));
  }

  // TODO: Create counselors
  createCounselors(counselors: any, shiftId: number, currentYear: boolean): Observable<any>{
    const data = JSON.stringify({
      shiftId: shiftId,
      coordinators: counselors,
      currentYear: currentYear
    });

    return this.http.post<any>(`${this.baseUrl}users/counselors`, data).pipe(catchError(this.handleError()));
  }

  // TODO: Create teachers
  createTeachers(teachers: any, shiftId: number, currentYear: boolean): Observable<any>{
    const data = JSON.stringify({
      shiftId: shiftId,
      teachers: teachers,
      currentYear: currentYear
    });

    return this.http.post<any>(`${this.baseUrl}users/teachers`, data).pipe(catchError(this.handleError()));
  }

  // TODO: Create coordinators
  createCoordinators(coordinators: any, shiftId: number, currentYear: boolean): Observable<any>{
    const data = JSON.stringify({
      shiftId: shiftId,
      coordinators: coordinators,
      currentYear: currentYear
    });

    return this.http.post<any>(`${this.baseUrl}users/coordinators`, data).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('users', error.error.message);
      return throwError(error.error);
    };
  }
}
