import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { ErrorMessageService } from 'src/app/shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  createReport(type: string, path: string): Observable<Blob | ArrayBuffer> {
    const url = this.baseUrl + 'reporting';

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    const data = {
      reportName: type,
      reportPath: path
    };

    return this.http
      .post<Blob>(url, JSON.stringify(data), {
        headers: headers,
        responseType: 'blob' as 'json'
      })
      .pipe(catchError(this.handleError()));
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
