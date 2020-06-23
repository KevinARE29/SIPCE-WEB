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
        catchError(this.handleError<Politics>(`getPolitics`))
      );
  }
   
  resetPassword(password) {
      return this.http.post<any>(`${this.baseUrl}auth/reset-password?resetPasswordToken=${this.resetPasswordToken}`, password)
       
  }

  updatePassword(password) {
    return this.http.post<any>(`${this.baseUrl}users/me/password`, password)
     
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
