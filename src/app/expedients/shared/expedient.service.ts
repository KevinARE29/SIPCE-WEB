import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ErrorMessageService } from 'src/app/shared/error-message.service';

import { Expedient } from './expedient.model';

@Injectable({
  providedIn: 'root'
})
export class ExpedientService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getExpedients(studentId: number): Observable<Expedient[]> {
    const url = this.baseUrl + 'students/' + studentId + '/expedients';

    return this.http.get<Expedient[]>(url).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('sessions', error.error.message);
      return throwError(error.error);
    };
  }
}
