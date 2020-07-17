import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorMessageService } from '../../shared/error-message.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Injectable({
  providedIn: 'root'
})
export class CycleService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  updateCycle(name: any, id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}academics/cycles${id}`, name).pipe(catchError(this.handleError()));
  }

  deleteCycle(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}academics/cycles${id}`).pipe(catchError(this.handleError()));
  }

  createCycle(name: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}academics/cycles`, name).pipe(catchError(this.handleError()));
  }

  searchCycle(params: NzTableQueryParams): Observable<any[]> {
    let url = this.baseUrl + 'academics/cycles';
    let queryParams = '';

    if (params) {
      if (params.sort[0].value) {
        queryParams += '&sort=' + params.sort[0].key;
        switch (params.sort[0].value) {
          case 'ascend':
            queryParams += '-' + params.sort[0].value.substring(0, 3);
            break;
          case 'descend':
            queryParams += '-' + params.sort[0].value.substring(0, 4);
            break;
        }
      }
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');
    url += queryParams;

    return this.http.get<any[]>(url).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('catalogs', error.error.message);
      return throwError(error.error);
    };
  }
}
