import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { environment } from './../../../environments/environment';
import DictionaryJson from '../../../assets/dictionary.json';
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
        catchError(this.handleError())
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
        catchError(this.handleError())
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
        catchError(this.handleError())
      );
  }

  createRole(role: Role): Observable<Role> {
    role.permissions = [1.1];
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
      const dictionary = DictionaryJson.dictionary["roles"];
      let errorMessage = error.error.message;
      
      if(Array.isArray(errorMessage)){
        let newMessage = new Array<string>();

        errorMessage.forEach( m => {
          let field  = m.split(":");

          if(dictionary.hasOwnProperty(field[0])){
            m = m.replace(field[0], dictionary[field[0]]);
            newMessage.push(m);
          }
        });

        error.error.message = newMessage;
      } else if(typeof errorMessage === 'string'){
        let field  = errorMessage.split(":");

        if(dictionary.hasOwnProperty(field[0])){
          errorMessage = errorMessage.replace(field[0], dictionary[field[0]]);
          error.error.message = errorMessage;
        }
      }

      return throwError(error.error);
    };
  }

}
