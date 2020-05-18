/* 
  Path: app/security-policies/shared/security-policy.service.ts
  Objetive: Define methods to manage data related to security policies
  Author: Esme López 
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from './../../../environments/environment';
import { SecurityPolicy } from './security-policy.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityPolicyService {
  baseUrl: string;

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'Authorization': localStorage.getItem('accessToken')
    })
  };

  constructor(private http: HttpClient) { 
    this.baseUrl = environment.apiURL;
    // TODO: Change for the getToken method
    localStorage.setItem('accessToken', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmcml2YXMiLCJlbWFpbCI6ImZlcm5hbmRvcml2YXNhcmV2YWxvMjdAZ21haWwuY29tIiwicGVybWlzc2lvbnMiOlsyLDFdLCJpYXQiOjE1ODk3NzE1NTcsImV4cCI6MTU4OTc3MzM1N30.0Xgrbf2JVC7GuBQknMShn8zuAgzzxfGnz3tKX-IzdcY');
  }

  getSecurityPolicies(): Observable<SecurityPolicy> {
    let url = this.baseUrl + 'auth/politics';

    return this.http.get<SecurityPolicy>(url, this.httpOptions)
      .pipe(
        map(
          (response: SecurityPolicy) => {
            let securityPolicy = new SecurityPolicy;

            securityPolicy = response['data'];
            securityPolicy.minActive = securityPolicy.minLength == 0 ? false : true;

            return securityPolicy;
          }
        ),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          console.log(`{outcome} security policies`);
        }),
        catchError(this.handleError<SecurityPolicy>(`getSecurityPolicies`))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 

     let errorMessage = `${operation} failed: ${error.message}`;

      // return of(result as T);
      return throwError(errorMessage);
    };
  }
}
