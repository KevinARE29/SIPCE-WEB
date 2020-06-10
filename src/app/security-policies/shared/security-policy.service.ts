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

  constructor(private http: HttpClient) { 
    this.baseUrl = environment.apiURL;
  }

  getSecurityPolicies(): Observable<any> {
    let url = this.baseUrl + 'auth/politics';

    return this.http.get<SecurityPolicy>(`${this.baseUrl}auth/politics`)
      .pipe(
        map(
          (response: SecurityPolicy) => {
            let securityPolicy = new SecurityPolicy;

            securityPolicy = response['data'];
            securityPolicy.minActive = securityPolicy.minLength == 0 ? false : true;
          
            return securityPolicy;
          }
        )
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
        )
      );
  }

}
