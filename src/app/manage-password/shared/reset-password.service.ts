import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
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
    this.activatedRoute.queryParams.subscribe((data) => {
      this.resetPasswordToken = data.resetPasswordToken;
    });
  }

  forgotPassword(email: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}auth/forgot-password`, email);
  }

  resetPassword(password: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}auth/reset-password?resetPasswordToken=${this.resetPasswordToken}`,
      password
    );
  }

  updatePassword(password: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}users/me/password`, password).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('update-password', error.error.message);
      return throwError(error.error);
    };
  }
}
