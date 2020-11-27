import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorMessageService } from '../../shared/error-message.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Sanction } from './sanction.model';
import { SanctionComponent } from '../components/sanction/sanction.component';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaryCatalogService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  searchSanctions(params: NzTableQueryParams, paginate: boolean): Observable<Sanction[]> {
    let url = this.baseUrl + 'sanctions';
    let queryParams = '';

    if (paginate) queryParams += '&page=' + params.pageIndex;

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

    return this.http.get<Sanction[]>(url).pipe(catchError(this.handleError()));
  }

  createSanction(sanction: Sanction): Observable<Sanction> {
    return this.http.post<Sanction>(`${this.baseUrl}sanctions`, sanction).pipe(catchError(this.handleError()));
  }

  deleteSanction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}sanctions/${id}`).pipe(catchError(this.handleError()));
  }

  updateSanction(sanction: Sanction): Observable<Sanction> {
    return this.http
      .put<Sanction>(`${this.baseUrl}sanctions/${sanction.id}`, sanction)
      .pipe(catchError(this.handleError()));
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
