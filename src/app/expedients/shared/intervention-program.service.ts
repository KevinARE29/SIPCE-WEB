import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ErrorMessageService } from 'src/app/shared/error-message.service';

import { InterventionProgram } from './intervention-program.model';

@Injectable({
  providedIn: 'root'
})
export class InterventionProgramService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getPrograms(params: NzTableQueryParams, search: InterventionProgram): Observable<InterventionProgram[]> {
    let url = this.baseUrl + 'intervention-programs';
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
      if (search.name) queryParams += '&name=' + search.name;

      if (search.type) queryParams += '&type=' + search.type;

      queryParams += '&status=' + search.status;
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<InterventionProgram[]>(url).pipe(catchError(this.handleError()));
  }

  getAvailablePrograms(): Observable<InterventionProgram[]> {
    const url = this.baseUrl + 'intervention-programs/availables';

    return this.http.get<InterventionProgram[]>(url).pipe(
      map((r) => r['data']),
      catchError(this.handleError())
    );
  }

  saveProgram(program: InterventionProgram): Observable<unknown> {
    let url = this.baseUrl + 'intervention-programs';

    const data = {
      name: program.name,
      type: program.type,
      description: program.description,
      status: program.id ? program.status : true
    };

    if (program.id) {
      url += '/' + program.id;
      return this.http.patch<InterventionProgram>(url, JSON.stringify(data)).pipe(catchError(this.handleError()));
    } else {
      return this.http.post<InterventionProgram>(url, JSON.stringify(data)).pipe(catchError(this.handleError()));
    }
  }

  deleteProgram(programId: number): Observable<void> {
    const url = this.baseUrl + 'intervention-programs/' + programId;

    return this.http.delete<void>(url).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('expedients', error.error.message);
      return throwError(error.error);
    };
  }
}
