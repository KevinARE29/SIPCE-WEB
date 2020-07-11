/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { User } from './user.model';
import { subMonths } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getUsers(params: NzTableQueryParams, search: User, paginate: boolean): Observable<User[]> {
    let url = this.baseUrl + 'users';
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
      if (search.username) queryParams += '&username=' + search.username;

      if (search.firstname) queryParams += '&firstname=' + search.firstname;

      if (search.lastname) queryParams += '&lastname=' + search.lastname;

      if (search.email) queryParams += '&email=' + search.email;

      if (search.roles[0].id) queryParams += '&role=' + search.roles[0].id;

      queryParams += '&active=' + !search.active;
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<User[]>(url).pipe(catchError(this.handleError()));
  }

  getUnauthorizedUsers(params: NzTableQueryParams, search: User, paginate: boolean): Observable<User[]> {
    let url = this.baseUrl + 'users';
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
      if (search.firstname) queryParams += '&firstname=' + search.firstname;

      if (search.lastname) queryParams += '&lastname=' + search.lastname;

      if (search.email) queryParams += '&email=' + search.email;

      if (search.roles[0].id) queryParams += '&role=' + search.roles[0].id;

      if (search.createdAt && search.createdAt[0] != undefined && search.createdAt[1] != undefined) {
        queryParams +=
          '&createdAtStart=' + search.createdAt[0].toISOString() + '&createdAtEnd=' + search.createdAt[1].toISOString();
      } else {
        const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
        let date = subMonths(currentDate, 1);

        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

        queryParams += '&createdAtStart=' + date.toISOString() + '&createdAtEnd=' + currentDate.toISOString();
      }
    }

    queryParams += '&credentials=false';
    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<User[]>(url).pipe(catchError(this.handleError()));
  }

  createAdministratives(administratives: any): Observable<any> {
    const users = new Array<any>();

    administratives.forEach((element) => {
      users.push({
        code: element.code.value,
        firstname: element.firstname.value,
        lastname: element.lastname.value,
        email: element.email.value,
        role: element.role.value,
        username: element.username.value
      });
    });

    const data = JSON.stringify({
      administratives: users
    });

    return this.http.post<any>(`${this.baseUrl}users/administratives`, data).pipe(catchError(this.handleError()));
  }

  createCounselors(counselors: any, shiftId: number, currentYear: boolean): Observable<any> {
    const users = new Array<any>();

    counselors.forEach((element) => {
      const grades = new Array<number>();
      Object.keys(element.grades.value).forEach((grade) => {
        grades.push(element['grades']['value'][grade]['grade']['id']);
      });

      users.push({
        code: element.code.value,
        firstname: element.firstname.value,
        lastname: element.lastname.value,
        email: element.email.value,
        username: element.username.value,
        grades: grades
      });
    });

    const data = JSON.stringify({
      shiftId: shiftId,
      counselors: users,
      currentYear: currentYear
    });

    return this.http.post<any>(`${this.baseUrl}users/counselors`, data).pipe(catchError(this.handleError()));
  }

  createTeachers(teachers: any, shiftId: number, currentYear: boolean): Observable<any> {
    const users = new Array<any>();

    teachers.forEach((element) => {
      users.push({
        cycleId: element.cycle.cycle.id,
        gradeId: element.grade.grade.id,
        sectionId: element.section.section.id,
        firstname: element.firstname.value,
        lastname: element.lastname.value,
        username: element.username.value,
        email: element.email.value,
        code: element.code.value
      });
    });

    const data = JSON.stringify({
      shiftId: shiftId,
      teachers: users,
      currentYear: currentYear
    });

    return this.http.post<any>(`${this.baseUrl}users/teachers`, data).pipe(catchError(this.handleError()));
  }

  createCoordinators(coordinators: any, shiftId: number, currentYear: boolean): Observable<any> {
    const users = new Array<any>();

    coordinators.forEach((element) => {
      users.push({
        cycleId: element.cycle.cycle.id,
        firstname: element.firstname.value,
        lastname: element.lastname.value,
        username: element.username.value,
        email: element.email.value,
        code: element.code.value
      });
    });

    const data = JSON.stringify({
      shiftId: shiftId,
      coordinators: users,
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
