import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Responsible } from './responsible.model';
import { ErrorMessageService } from 'src/app/shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getResponsibles(id: number): Observable<Responsible[]> {
    return this.http
      .get<Responsible[]>(`${this.baseUrl}students/${id}/responsibles`)
      .pipe(catchError(this.handleError()));
  }

  createResponsible(id: number, responsible: Responsible): Observable<Responsible> {
    return this.http
      .post<Responsible>(`${this.baseUrl}students/${id}/responsibles`, responsible)
      .pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('students', error.error.message);
      return throwError(error.error);
    };
  }
}
