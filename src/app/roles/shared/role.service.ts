/* 
  Path: app/roles/shared/role.service.ts
  Objective: Define methods to manage data related to roles
  Author: Esme López 
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from '../../shared/error-message.service';
import { Role } from './role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getRole(id: number): Observable<Role>{
    return this.http.get<Role>(`${this.baseUrl}auth/roles/${id}`)
      .pipe(
        map(
          (response: Role) => {
            let role = new Role;
            role.permissions = new Array<number>();

            role.id = response['data'].id;
            role.name = response['data'].name;

            response['data'].permissions.forEach(p => {
              role.permissions.push(p.id);
            });

            return role;
          }
        ),
        catchError(this.handleError())
      );
  }

  searchRoles(params: NzTableQueryParams, search: string, paginate: boolean): Observable<Role[]> {
    let url = this.baseUrl + 'auth/roles';
    let queryParams: string = '';

    if(search)
      queryParams += '?name='+search;
    
    if(paginate)
      queryParams += '&page='+params.pageIndex;

    if(params){
      if(params.sort[0].value){
        queryParams += '&sort='+params.sort[0].key;
      
        switch(params.sort[0].value){
          case "ascend":
            queryParams += "-" + params.sort[0].value.substring(0,3);
            break;
          case "descend":
            queryParams += "-" + params.sort[0].value.substring(0,4);
            break;
        }
      }      
    }  

    if(queryParams.charAt(0)==='&')
      queryParams = queryParams.replace('&','?');

    url += queryParams;

    return this.http.get<Role[]>(url)
      .pipe(
        catchError(this.handleError())
      );
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}auth/roles`, role)
      .pipe(
        catchError(this.handleError())
      );
  }

  updateRole(role:Role): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}auth/roles/${role.id}`, role)
      .pipe(
        catchError(this.handleError())
      );
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}auth/roles/${id}`)
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
      error.error.message = this.errorMessageService.transformMessage("roles", error.error.message);
      return throwError(error.error);
    };
  }

}
