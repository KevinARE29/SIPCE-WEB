import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { FoulsCounter } from './fouls-counter.model';

@Injectable({
  providedIn: 'root'
})
export class FoulsSanctionsService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getFoulsCounter(studentId: number, historyId: number): Observable<FoulsCounter[]> {
    const url = this.baseUrl + 'students/' + studentId + '/histories/' + historyId + '/fouls/counter';

    return this.http.get<FoulsCounter[]>(url).pipe(
      map((r) => {
        return r['data'];
      }),
      catchError(this.handleError)
    );
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
