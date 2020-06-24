/* 
  Path: app/security-policies/shared/security-policy.service.ts
  Objective: Define methods to manage data related to security policies
  Author: Esme López 
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from '../../shared/error-message.service';
import { SecurityPolicy } from './security-policy.model';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityPolicyService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) { 
    this.baseUrl = environment.apiURL;
  }

  getSecurityPolicies(): Observable<any> {
    return this.http.get<SecurityPolicy>(`${this.baseUrl}auth/politics`)
      .pipe(
        map(
          (response: SecurityPolicy) => {
            let securityPolicy = new SecurityPolicy;

            securityPolicy = response['data'];
            securityPolicy.minActive = securityPolicy.minLength == 0 ? false : true;
          
            return securityPolicy;
          }
        ),
        catchError(this.handleError())
      );
  }

  updateSecurityPolicies(policies: SecurityPolicy){
    if(!policies.minActive)  
      policies.minLength = 0;

    let data = JSON.stringify({
      id: policies.id,
      minLength: policies.minLength,
      capitalLetter: policies.capitalLetter,
      lowerCase: policies.lowerCase,
      numericChart: policies.numericChart,
      specialChart: policies.specialChart
    });

    return this.http.put<SecurityPolicy>(`${this.baseUrl}auth/politics/${policies.id}`, data)
      .pipe(
        map(
          (response: SecurityPolicy) => {            
            let securityPolicy = new SecurityPolicy;
            
            securityPolicy = response['data'];
            securityPolicy.minActive = securityPolicy.minLength == 0 ? false : true;
          
            return securityPolicy;
          }
        ),
        catchError(this.handleError())
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage("security-policies", error.error.message);
      console.log(error.message);
      return throwError(error.error);
    };
  }
}
