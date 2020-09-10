import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { Student } from '../../students/shared/student.model';
import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { User } from 'src/app/users/shared/user.model';
import { Events } from './events.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  createAppointment(data: any): Observable<any> {
    console.log(data);
    return this.http.post<any>(`${this.baseUrl}me/schedules`, data).pipe(catchError(this.handleError()));
  }

  getEvents(fromDate: Date, toDate: Date): Observable<Events[]> {
    const startDate = fromDate.toISOString();
    const endDate = toDate.toISOString();

    return this.http.get<Events[]>(`${this.baseUrl}me/schedules?fromDate=${startDate}&toDate=${endDate}`).pipe(
      map((response) => {
        const events = new Array<Events>();
        response.forEach((event) => {
          event['jsonData'].EndTime = new Date(event['jsonData'].EndTime);
          event['jsonData'].StartTime = new Date(event['jsonData'].StartTime);
          events.push(event['jsonData']);
        });
        return events;
      }),
      catchError(this.handleError())
    );
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
