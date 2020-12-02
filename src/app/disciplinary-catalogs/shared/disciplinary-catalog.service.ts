import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorMessageService } from '../../shared/error-message.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Sanction } from './sanction.model';
import { Foul } from './foul.model';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaryCatalogService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  searchSanctions(params: NzTableQueryParams, search: string, paginate: boolean): Observable<Sanction[]> {
    let url = this.baseUrl + 'sanctions';
    let queryParams = '';

    if (search) queryParams += '?name=' + search;

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

  deleteSanction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}sanctions/${id}`).pipe(catchError(this.handleError()));
  }

  updateSanction(sanction: Sanction, sanctionId: number): Observable<Sanction> {
    return this.http
      .put<Sanction>(`${this.baseUrl}sanctions/${sanctionId}`, sanction)
      .pipe(catchError(this.handleError()));
  }

  /* Fouls services */
  getFouls(params: NzTableQueryParams, search: Foul, paginate: boolean): Observable<Foul[]> {
    let url = this.baseUrl + 'fouls';
    let queryParams = '';

    // Paginate
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
      if (search.numeral) queryParams += '&numeral=' + search.numeral;

      if (search.foulsType) queryParams += '&foulsType=' + search.foulsType;
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<Foul[]>(url).pipe(catchError(this.handleError()));
  }

  createFoul(foul: Foul): Observable<Foul> {
    return this.http.post<Foul>(`${this.baseUrl}fouls`, foul).pipe(catchError(this.handleError()));
  }

  deleteFoul(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}fouls/${id}`).pipe(catchError(this.handleError()));
  }

  updateFoul(foul: Foul, foulId: number): Observable<Foul> {
    return this.http.put<Foul>(`${this.baseUrl}fouls/${foulId}`, foul).pipe(catchError(this.handleError()));
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('disciplinary-catalog', error.error.message);
      return throwError(error.error);
    };
  }
}
