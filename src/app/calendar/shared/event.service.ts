import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Appointment } from './appointment.model';

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

  getCounselingRequests(): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}me/requests`).pipe(catchError(this.handleError()));
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
