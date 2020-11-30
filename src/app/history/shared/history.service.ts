import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { StudentWithHistory } from './student-with-history.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { History } from './history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getStudents(params: NzTableQueryParams, search: StudentWithHistory): Observable<StudentWithHistory[]> {
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

    return this.http.get<StudentWithHistory[]>(url).pipe(catchError(this.handleError()));
  }

  getStudentHistory(studentId: number): Observable<History[]> {
    const url = environment.apiURL + 'students/' + studentId + '/histories';

    return this.http.get(url).pipe(
      map((response) => {
        return response['data'];
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
