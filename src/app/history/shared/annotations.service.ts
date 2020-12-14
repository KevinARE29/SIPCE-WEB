import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { Annotation } from './annotation.model';

@Injectable({
  providedIn: 'root'
})
export class AnnotationsService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getAnnotations(
    studentId: number,
    historyId: number,
    params: NzTableQueryParams,
    search: Annotation
  ): Observable<Annotation[]> {
    let url = this.baseUrl + 'students/' + studentId + '/histories/' + historyId + '/annotations';
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
      if (search.reporter.firstname) queryParams += '&reporter=' + search.reporter.firstname;

      if (search.title) queryParams += '&title=' + search.title;

      if (search.startedAt) queryParams += '&startedAt=' + search.startedAt.toISOString();

      if (search.finishedAt) queryParams += '&finishedAt=' + search.finishedAt.toISOString();
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<Annotation[]>(url).pipe(catchError(this.handleError()));
  }

  saveAnnotation(studentId: number, historyId: number, annotation: Annotation): Observable<Annotation> {
    let url = this.baseUrl + 'students/' + studentId + '/histories/' + historyId + '/annotations';

    const data = {
      title: annotation.title,
      description: annotation.description,
      annotationDate: annotation.annotationDate
    };

    if (annotation.id) {
      url += '/' + annotation.id;
      return this.http.patch<Annotation>(url, JSON.stringify(data)).pipe(catchError(this.handleError()));
    } else {
      return this.http.post<Annotation>(url, JSON.stringify(data)).pipe(catchError(this.handleError()));
    }
  }

  deleteAnnotation(studentId: number, historyId: number, annotationId: number): Observable<void> {
    const url = this.baseUrl + 'students/' + studentId + '/histories/' + historyId + '/annotations/' + annotationId;

    return this.http.delete<void>(url).pipe(catchError(this.handleError()));
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
