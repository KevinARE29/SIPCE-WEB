import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { SecurityPolicy } from '../../security-policies/shared/security-policy.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Politics } from '../politics';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  baseUrl: string;
  resetPasswordToken = '';

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) {
    this.baseUrl = environment.apiURL;
    this.activatedRoute.queryParams.subscribe(data => {
      this.resetPasswordToken =data.resetPasswordToken;
      console.log(this.resetPasswordToken);
            });
   }

   getPolitics() {
    let url = this.baseUrl + 'auth/politics';
     return this.http.get<Politics>(`${this.baseUrl}auth/politics`)
      .pipe(
        map(
          (response: Politics) => {
        //    securityPolicy.minActive = securityPolicy.minLength == 0 ? false : true;
            return response;
          }
        ),
        tap(h => {
          const outcome = h ? `Fetched` : `Did not find`;
          console.log(`${outcome} security policies`);
        }),
        catchError(this.handleError<SecurityPolicy>(`getSecurityPolicies`))
      );
  }
   
  resetPassword(){
    
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
