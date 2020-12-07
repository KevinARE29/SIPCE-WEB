import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

import { ErrorMessageService } from 'src/app/shared/error-message.service';

import { SessionTypes } from './../../shared/enums/session-types.enum';

import { StudentWithSessions } from './student-with-sessions.model';
import { Session } from './session.model';
import { StudentWithSession } from './student-with-session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getSessions(params: NzTableQueryParams, search: StudentWithSessions): Observable<StudentWithSessions[]> {
    let url = this.baseUrl + 'sessions';
    let queryParams = '';

    // Params
    if (params) {
      // Paginate?
      queryParams += '?page=' + params.pageIndex;

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

      if (search.shift && search.shift.id) queryParams += '&currentShift=' + search.shift.id;

      if (search.grade && search.grade.id) queryParams += '&currentGrade=' + search.grade.id;
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<StudentWithSessions[]>(url).pipe(catchError(this.handleError()));
  }

  getStudentSessions(
    studentId: number,
    expedientId: number,
    params: NzTableQueryParams,
    search: Session
  ): Observable<Session[]> {
    let url = this.baseUrl + 'students/' + studentId + '/expedients/' + expedientId + '/sessions';
    let queryParams = '';

    // Params
    if (params) {
      // Paginate?
      queryParams += '?page=' + params.pageIndex;

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
      if (search.startedAt) queryParams += '&startedAt=' + search.startedAt.toISOString();

      if (search.finishedAt) queryParams += '&finishedAt=' + search.finishedAt.toISOString();

      if (search.sessionType) queryParams += '&sessionType=' + search.sessionType;
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<Session[]>(url).pipe(catchError(this.handleError()));
  }

  getSession(expedientId: number, studentId: number, sessionId: number): Observable<Session> {
    const url = this.baseUrl + 'students/' + studentId + '/expedients/' + expedientId + '/sessions/' + sessionId;

    return this.http.get<Session>(url).pipe(catchError(this.handleError()));
  }

  saveSession(expedientId: number, studentId: number, session: Session): Observable<unknown> {
    let url = this.baseUrl + 'students/' + studentId + '/expedients/' + expedientId + '/sessions';

    const data = {
      sessionType: session.sessionType,
      serviceType: session.serviceType,
      evaluations: session.evaluations,
      startedAt: session.startedAt,
      duration: session.duration,
      comments: session.comments,
      draft: session.draft
    };

    if (session.sessionType === SessionTypes.SESION) {
      data['interventionProgramId'] = session.interventionProgramId;
    }

    if (session.sessionType === SessionTypes.ENTREVISTA_DOCENTE) {
      data['participants'] = session.participants;
    }

    if (session.sessionType === SessionTypes.ENTREVISTA_PADRES) {
      data['startHour'] = session.startHour;
      data['agreements'] = session.agreements;
      data['treatedTopics'] = session.treatedTopics;
      data['responsibles'] = session.responsibles;
      data['otherResponsible'] = session.otherResponsible;
    }

    if (session.id) {
      url += '/' + session.id;
      return this.http.patch<Session>(url, JSON.stringify(data)).pipe(catchError(this.handleError()));
    } else {
      return this.http.post<Session>(url, JSON.stringify(data)).pipe(catchError(this.handleError()));
    }
  }

  deleteSession(expedientId: number, studentId: number, sessionId: number): Observable<void> {
    const url = this.baseUrl + 'students/' + studentId + '/expedients/' + expedientId + '/sessions/' + sessionId;

    return this.http.delete<void>(url).pipe(catchError(this.handleError()));
  }

  exportSession(
    studentId: number,
    expedientId: number,
    sessionId: number,
    token: string
  ): Observable<StudentWithSession> {
    const url =
      this.baseUrl +
      'reporting/students/' +
      studentId +
      '/expedients/' +
      expedientId +
      '/sessions/' +
      sessionId +
      '?token=' +
      token;

    return this.http.get<StudentWithSession>(url).pipe(
      map((r) => {
        const data = r['data'];
        data.student.section = data.student.sectionDetails ? data.student.sectionDetails[0].section : null;
        data.session.startDateString = format(new Date(data.session.startedAt), 'd/MMMM/yyyy', { locale: es });
        data.session.finishAt = addMinutes(new Date(data.session.startHour), data.session.duration);

        return data;
      }),
      catchError(this.handleError())
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
