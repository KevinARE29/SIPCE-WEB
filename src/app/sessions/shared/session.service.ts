import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { Student } from 'src/app/students/shared/student.model';
import { ErrorMessageService } from 'src/app/shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getSessions(params: NzTableQueryParams, search: Student): Observable<Student[]> {
    let url = this.baseUrl + 'students';
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
      console.log(search);
      if (search.code) queryParams += '&code=' + search.code;

      if (search.firstname) queryParams += '&firstname=' + search.firstname;

      if (search.lastname) queryParams += '&lastname=' + search.lastname;

      if (search.shift && search.shift.id) queryParams += '&currentShift=' + search.shift.id;

      if (search.grade && search.grade.id) queryParams += '&currentGrade=' + search.grade.id;
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<Student[]>(url).pipe(
      catchError(this.handleError())
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('sessions', error.error.message);
      return throwError(error.error);
    };
  }
}
