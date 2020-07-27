import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorMessageService } from '../../shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getSchedule(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}academics/cycles/`).pipe(catchError(this.handleError()));
  }

  updateSchedule(name: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}academics/cycles/${id}`, name).pipe(catchError(this.handleError()));
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}academics/cycles/${id}`).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('schedule', error.error.message);
      return throwError(error.error);
    };
  }
}
