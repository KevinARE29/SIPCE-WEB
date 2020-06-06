import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { environment } from './../../../environments/environment';
import { Role } from './role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiURL;
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}auth/roles`)
      .pipe(
        catchError(this.handleError<Role[]>(`getRoles`))
      );
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
        catchError(this.handleError<Role>(`getRole`))
      );
  }

  searchRoles(params: NzTableQueryParams, search: string, paginate: boolean): Observable<Role[]> {
    let url = this.baseUrl + 'auth/roles';
    let queryParams = '?';

    if(search){
      queryParams += 'name='+search;
    }

    if(paginate){
      queryParams += '&page='+params.pageIndex;
      
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
    }else{
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
    }

    url += queryParams;
    
    return this.http.get<Role[]>(url)
      .pipe(
        catchError(this.handleError<Role[]>(`searchRoles`))
      );
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(`${this.baseUrl}auth/roles`, role)
      .pipe(
        catchError(this.handleError<Role>(`createRoles`))
      );
  }

  updateRole(role:Role): Observable<Role> {
    return this.http.put<Role>(`${this.baseUrl}auth/roles/${role.id}`, role)
      .pipe(
        catchError(this.handleError<Role>(`updateRole`))
      );
  }

  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}auth/roles/${id}`)
      .pipe(
        catchError(this.handleError<any>(`deleteRole`))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      return throwError(error.error);
    };
  }
}
