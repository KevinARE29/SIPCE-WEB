import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { SecurityPolicy } from '../../security-policies/shared/security-policy.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ErrorMessageService } from '../../shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  baseUrl: string;
  resetPasswordToken = '';

  constructor(
    private http: HttpClient,  
    private errorMessageService: ErrorMessageService, 
    private activatedRoute: ActivatedRoute
  ) {
    this.baseUrl = environment.apiURL;
    this.activatedRoute.queryParams.subscribe(data => {
      this.resetPasswordToken =data.resetPasswordToken;
    });
  }

  //  getPolitics() {
  //   let url = this.baseUrl + 'auth/politics';
  //    return this.http.get<Politics>(`${this.baseUrl}auth/politics`)
  //     .pipe(
  //       map(
  //         (response: Politics) => {
  //           return response;
  //         }
  //       ),
  //       tap(h => {
  //         const outcome = h ? `Fetched` : `Did not find`;
  //        }),
  //       catchError(this.handleError())
  //     );
  // }
   
  resetPassword(password: any): Observable<any> { 
    return this.http.post<any>(`${this.baseUrl}auth/reset-password?resetPasswordToken=${this.resetPasswordToken}`, password)
  }

  updatePassword(password: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}users/me/password`, password)
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
      error.error.message = this.errorMessageService.transformMessage("update-password", error.error.message);
     return throwError(error.error);
    };
  }

}
