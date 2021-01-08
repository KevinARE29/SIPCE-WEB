import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { subMonths } from 'date-fns';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Appointment } from './appointment.model';
import { Student } from 'src/app/students/shared/student.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getEvents(fromDate: Date, toDate: Date): Observable<Appointment[]> {
    const startDate = fromDate.toISOString();
    const endDate = toDate.toISOString();

    return this.http.get<Appointment[]>(`${this.baseUrl}me/schedules?fromDate=${startDate}&toDate=${endDate}`).pipe(
      map((response) => {
        const events = new Array<Appointment>();
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

  markEventsAsRead(eventsIdArray: Array<number>): Observable<void> {
    const data = JSON.stringify({
      eventsId: eventsIdArray
    });
    return this.http.post<void>(`${this.baseUrl}me/schedules/notifications`, data).pipe(catchError(this.handleError()));
  }

  createEvent(calendarEvent: Appointment, event: Appointment): Observable<Appointment> {
    const participants = new Array<number>();

    calendarEvent.Student = event.Student;
    calendarEvent.Participants = event.Participants;
    event.Participants.forEach((participant) => {
      participants.push(participant.id);
    });

    const data = JSON.stringify({
      eventType: calendarEvent.EventType,
      jsonData: calendarEvent,
      participantIds: participants,
      studentId: event.Student ? event.Student.id : null
    });

    return this.http.post<Appointment>(`${this.baseUrl}me/schedules`, data).pipe(catchError(this.handleError()));
  }

  updateEventAfterDelete(event: Appointment): Observable<Appointment> {
    const participants = new Array<number>();

    event['Participants'].forEach((user) => {
      participants.push(user.id);
    });

    const data = JSON.stringify({
      eventType: event.EventType,
      jsonData: event,
      participantIds: participants,
      studentId: event.Student ? event.Student.id : null
    });

    return this.http
      .put<Appointment>(`${this.baseUrl}me/schedules/${event.Id}`, data)
      .pipe(catchError(this.handleError()));
  }

  updateEvent(calendarEvent: Appointment, event: Appointment): Observable<Appointment> {
    const participants = new Array<number>();

    // A series of events doesn't need a RecurrenceID
    if (calendarEvent.RecurrenceID === calendarEvent.Id) delete calendarEvent.RecurrenceID;

    // Add the event's participants
    calendarEvent.Student = event.Student;
    calendarEvent.Participants = event.Participants;
    event.Participants.forEach((participant) => {
      participants.push(participant.id);
    });

    const data = JSON.stringify({
      eventType: calendarEvent.EventType,
      jsonData: calendarEvent,
      participantIds: participants,
      studentId: event.Student ? event.Student.id : null
    });

    return this.http
      .put<Appointment>(`${this.baseUrl}me/schedules/${calendarEvent.Id}`, data)
      .pipe(catchError(this.handleError()));
  }

  deleteEvent(eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}me/schedules/${eventId}`).pipe(catchError(this.handleError()));
  }

  getCounselingRequests(params: NzTableQueryParams, search: Student, paginate: boolean): Observable<unknown> {
    let url = this.baseUrl + 'me/requests';
    let queryParams = '';

    // Paginate?
    if (paginate) queryParams += '?page=' + params.pageIndex;

    // Params
    if (params) {
      let sort = '&sort=';
      params.sort.forEach((param) => {
        if (param.value) {
          sort += param.key;
          switch (param.value) {
            case 'ascend':
              sort += '-' + param.value.substring(0, 3) + ',';
              break;
            case 'descend':
              sort += '-' + param.value.substring(0, 4) + ',';
              break;
          }
        }
      });

      if (sort.length > 6) {
        if (sort.charAt(sort.length - 1) === ',') sort = sort.slice(0, -1);

        queryParams += sort;
      }
    }

    if (search) {
      if (search.code) queryParams += '&code=' + search.code;

      if (search.firstname) queryParams += '&firstname=' + search.firstname;

      if (search.lastname) queryParams += '&lastname=' + search.lastname;

      if (search.currentShift && search.currentShift.id) queryParams += '&currentShift=' + search.currentShift.id;

      if (search.grade && search.grade.id) queryParams += '&currentGrade=' + search.grade.id;
    }

    if (search && search['createdAt'] && search['createdAt'][0] != undefined && search['createdAt'][1] != undefined) {
      queryParams +=
        '&createdAtStart=' +
        search['createdAt'][0].toISOString() +
        '&createdAtEnd=' +
        search['createdAt'][1].toISOString();
    } else {
      const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
      let date = subMonths(currentDate, 1);

      date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

      queryParams += '&createdAtStart=' + date.toISOString() + '&createdAtEnd=' + currentDate.toISOString();
    }

    queryParams += '&perPage=' + (params ? params.pageSize : 12);

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;
    return this.http.get<unknown>(url).pipe(catchError(this.handleError()));
  }

  answerRequest(requestId: number, status: string): Observable<void> {
    const data = JSON.stringify({ status });
    return this.http.patch<void>(`${this.baseUrl}me/requests/${requestId}`, data).pipe(catchError(this.handleError()));
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
