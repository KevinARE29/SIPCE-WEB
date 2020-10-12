import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  requestConsulation(email: string, subject: string, comment: string): Observable<void> {
    const data = {};
    let jsonData = null;

    data['email'] = email;
    data['subject'] = subject;
    if (comment) data['comment'] = comment;

    jsonData = JSON.stringify(data);

    return this.http.post<void>(`${this.baseUrl}counseling/requests`, jsonData);
  }

  verifyCounselingRequest(confirmationToken: string): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}counseling/requests/verification?confirmationToken=${confirmationToken}`, {})
      .pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('counseling', error.error.message);
      return throwError(error.error);
    };
  }
}
