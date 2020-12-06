import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { StudentWithCounters } from './student-with-counters.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { History } from './history.model';
import { StudentWithHistory } from './student-with-history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getStudents(params: NzTableQueryParams, search: StudentWithCounters): Observable<StudentWithCounters[]> {
    let url = this.baseUrl + 'behavioral-histories';
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

      if (search.section && search.section.id) queryParams += '&section=' + search.section.id;
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<StudentWithCounters[]>(url).pipe(catchError(this.handleError()));
  }

  getStudentHistory(studentId: number): Observable<History[]> {
    const url = this.baseUrl + 'students/' + studentId + '/histories';

    return this.http.get(url).pipe(
      map((response) => {
        return response['data'];
      }),
      catchError(this.handleError())
    );
  }

  updateHistory(studentId: number, history: History): Observable<void> {
    const url = this.baseUrl + 'students/' + studentId + '/histories/' + history.id;

    const data = {
      finalConclusion: history.finalConclusion
    };

    return this.http.patch<void>(url, JSON.stringify(data)).pipe(catchError(this.handleError));
  }

  exportHistory(
    studentId: number,
    historyId: number,
    token: string,
    filters: string[],
    userId: string
  ): Observable<StudentWithHistory> {
    const url =
      this.baseUrl +
      'reporting/students/' +
      studentId +
      '/histories/' +
      historyId +
      '?token=' +
      token +
      '&userId=' +
      userId +
      '&filter=' +
      filters.join(',');

    return this.http.get<StudentWithHistory>(url).pipe(
      map((r) => {
        const data: StudentWithHistory = r['data'];
        data.date = format(new Date(), 'd/MMMM/yyyy', { locale: es });
        data.student.section = data.student['sectionDetails'] ? data.student['sectionDetails'][0].section : null;

        data.behavioralHistory.createdAtString = format(new Date(data.behavioralHistory['createdAt']), 'd/MMMM/yyyy', {
          locale: es
        });

        data.behavioralHistory.annotations.forEach((annotation) => {
          annotation.annotationDateString = format(new Date(annotation.annotationDate), 'd/MMMM/yyyy', { locale: es });
        });

        data.behavioralHistory.behavioralHistoryfouls.forEach((period) => {
          period.fouls.forEach((foul) => {
            foul.issueDateString = format(new Date(foul.issueDate), 'd/MMMMM/yyyy', { locale: es });
          });
        });

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
