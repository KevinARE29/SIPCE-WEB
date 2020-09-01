/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { User } from './user.model';
import { subMonths } from 'date-fns';
import { RoleService } from 'src/app/roles/shared/role.service';
import { PermissionService } from 'src/app/roles/shared/permission.service';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private errorMessageService: ErrorMessageService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}users/${id}`).pipe(catchError(this.handleError()));
  }

  getUserProfile(): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}me`).pipe(
      map((response) => {
        if (response['data']['teacherAssignation']) {
          const teacherAssignation = new Array<unknown>();

          Object.values(response['data']['teacherAssignation']).forEach((assignation) => {
            teacherAssignation.push({
              shift: assignation[0]['shift'],
              cycle: assignation[0]['cycle'],
              grade: assignation[0]['gradeDetails'][0]['grade'],
              section: new ShiftPeriodGrade() // TODO: Set section
            });
          });

          response['data']['teacherAssignation'] = teacherAssignation;
        }
        return response['data'];
      }),
      catchError(this.handleError())
    );
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

  getUsersByRole(roleId: number) {
    return this.http.get<User>(`${this.baseUrl}users?role=${roleId}&paginate=false`).pipe(
      map((response: User) => {
        response['data'].forEach((user) => {
          user.fullname = user['firstname'].concat(' ', user['lastname']);
        });

        response['data'] = response['data'].filter((x) => x.active === true); // TODO: Remove

        return response;
      }),
      catchError(this.handleError())
    );
  }

  getUnauthorizedUsers(params: NzTableQueryParams, search: User, paginate: boolean): Observable<any> {
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

      queryParams += '&perPage=' + params.pageSize;
    } else queryParams += '&perPage=' + '10';

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

    return this.http.get<User[]>(url).pipe(
      map((response) => {
        const usersResponse = new Array<any>();

        for (let i = 0; i < response['data'].length; i++) {
          usersResponse[i] = { user: response['data'][i], disabled: false };
        }

        return { data: usersResponse, pagination: response['pagination'] };
      }),
      catchError(this.handleError())
    );
  }

  bulkUsers(users: any): Observable<any> {
    const newUsers = new Array<any>();

    users.forEach((element) => {
      const ids = new Array<number>();
      Object.keys(element['role']['value']).forEach((role) => {
        if (element['role']['value'][role]['role']) {
          const id = element['role']['value'][role]['role']['id'];
          if (id) ids.push(element['role']['value'][role]['role']['id']);
        }
      });

      newUsers.push({
        code: element.code.value,
        firstname: element.firstname.value,
        lastname: element.lastname.value,
        email: element.email.value,
        roleIds: ids,
        username: element.username.value
      });
    });

    const data = JSON.stringify({
      users: newUsers
    });

    return this.http.post<any>(`${this.baseUrl}users/bulk`, data).pipe(catchError(this.handleError()));
  }

  createUser(user: User): Observable<User> {
    const data = JSON.stringify({
      code: user.code,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      roleIds: user.roles,
      permissionIds: user.permissions
    });

    return this.http.post<User>(`${this.baseUrl}users`, data).pipe(catchError(this.handleError()));
  }

  updateUser(user: User): Observable<User> {
    const data = JSON.stringify({
      code: user.code,
      active: user.active,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      roleIds: user.roles,
      permissionIds: user.permissions
    });

    return this.http.put<User>(`${this.baseUrl}users/${user.id}`, data).pipe(catchError(this.handleError()));
  }

  generateCredentials(users: number[]): Observable<any> {
    const data = JSON.stringify({ ids: users });
    return this.http.post<any>(`${this.baseUrl}users/credentials`, data).pipe(catchError(this.handleError()));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}users/${id}`).pipe(catchError(this.handleError()));
  }

  mergeUserData(id: number): Observable<any> {
    return forkJoin({
      roles: this.roleService.getAllRoles(),
      permissions: this.permissionService.getPermissions(),
      user: this.getUser(id)
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      console.log(error);
      error.error.message = this.errorMessageService.transformMessage('users', error.error.message);
      return throwError(error.error);
    };
  }
}
