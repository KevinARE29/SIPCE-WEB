import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { SecurityPolicy } from '../../security-policies/shared/security-policy.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Politics } from '../politics';
import { updatePasswordI } from '../../manage-password/update-password';
import { ErrorMessageService } from '../../shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  baseUrl: string;
  resetPasswordToken = '';
  updatePsw: updatePasswordI;

  constructor(private http: HttpClient,  private errorMessageService: ErrorMessageService, private router: Router, private activatedRoute: ActivatedRoute) {
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
        }),
        catchError(this.handleError())
      );
  }
   
  resetPassword(password) {
      return this.http.post<any>(`${this.baseUrl}auth/reset-password?resetPasswordToken=${this.resetPasswordToken}`, password)
       
  }

  updatePassword(password) {
    return this.http.patch<updatePasswordI>(`${this.baseUrl}users/me/password`, password)
    .pipe(
      map(
        (response: updatePasswordI) => {                    
          this.updatePsw.data = response.data;  
          return this.updatePsw;
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
      error.error.message = this.errorMessageService.transformMessage("update-password", error.error.message);
     return throwError(error.error);
    };
  }

}
