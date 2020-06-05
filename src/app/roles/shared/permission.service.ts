import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

import { environment } from './../../../environments/environment';
import { AppPermission } from './app-permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  baseUrl: string;

  constructor(private http: HttpClient) { 
    this.baseUrl = environment.apiURL;
  }

  getPermissions(): Observable<AppPermission[]> {
    return this.http.get<AppPermission[]>(`${this.baseUrl}auth/permissions`)
      .pipe(
        catchError(this.handleError<AppPermission[]>(`getPermissions`))
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
