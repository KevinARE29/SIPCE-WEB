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
  // TODO: Delete
  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlbG9wZXoiLCJlbWFpbCI6ImxvcmVuYWVndWFkcm9uQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjpbMiwxXSwiaWF0IjoxNTkwMTM1NTYwLCJleHAiOjE1OTAxMzczNjB9.s3x4nrriagJQiDLFELj14wk1NjDjujOJ7dSevE8VTaY";

  httpOptions = {
    headers: new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'Authorization': localStorage.getItem('accessToken')
    })
  };

  constructor(private http: HttpClient) { 
    this.baseUrl = environment.apiURL;
    // TODO: Delete
    localStorage.setItem('accessToken', 'Bearer ' + this.token);
  }

  getSecurityPolicies(): Observable<any> {
    let url = this.baseUrl + 'auth/politics';

    return this.http.get<SecurityPolicy>(url, this.httpOptions)
      .pipe(
        map(
          (response: SecurityPolicy) => {
            let securityPolicy = new SecurityPolicy;

            securityPolicy = response['data'];
            securityPolicy.minActive = securityPolicy.minLength == 4 ? false : true;
          
            return securityPolicy;
          }
        ),
        tap(h => {
          const outcome = h ? `Fetched` : `Did not find`;
          console.log(`${outcome} security policies`);
        }),
        catchError(this.handleError<SecurityPolicy>(`getSecurityPolicies`))
      );
  }

  updateSecurityPolicies(policies: SecurityPolicy){
    let url = this.baseUrl + 'auth/politics/' + policies.id;

    if(!policies.minActive)  
      policies.minLength = 4;

    let data = JSON.stringify({
      id: policies.id,
      minLength: policies.minLength,
      capitalLetter: policies.capitalLetter,
      lowerCase: policies.lowerCase,
      numericChart: policies.numericChart,
      specialChart: policies.specialChart
    });

    console.log(data);

    return this.http.put<SecurityPolicy>(url, data,this.httpOptions)
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
          const outcome = h ? `Fetched` : `Did not find`;
          console.log(`${outcome} security policies`);
        }),
        catchError(this.handleError<SecurityPolicy>(`updateSecurityPolicies`))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    //  let errorMessage = `${operation} failed: ${error.message}`;
      return throwError(error.status);
    };
  }
}
