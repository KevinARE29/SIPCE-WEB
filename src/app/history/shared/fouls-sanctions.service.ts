import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ErrorMessageService } from 'src/app/shared/error-message.service';
import { FoulsCounter } from './fouls-counter.model';
import { FoulAssignation } from './foul-assignation.model';

@Injectable({
  providedIn: 'root'
})
export class FoulsSanctionsService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getFoulsCounter(studentId: number, historyId: number): Observable<FoulsCounter[]> {
    const url = this.baseUrl + 'students/' + studentId + '/histories/' + historyId + '/fouls/counter';

    return this.http.get<FoulsCounter[]>(url).pipe(
      map((r) => {
        let data = r['data'];

        if (Array.isArray(data) && data.length) {
          data = data.map((counter: FoulsCounter) => {
            counter.foulsCounter.minorFoulsAlert = counter.foulsCounter.minorFouls >= 3;
            counter.foulsCounter.seriousFoulsAlert = counter.foulsCounter.seriousFouls >= 1;
            counter.foulsCounter.verySeriousFoulsAlert = counter.foulsCounter.verySeriousFouls >= 1;

            counter.displayAlert =
              counter.foulsCounter.minorFoulsAlert ||
              counter.foulsCounter.seriousFoulsAlert ||
              counter.foulsCounter.verySeriousFoulsAlert;

            return counter;
          });
        }

        return data;
      }),
      catchError(this.handleError)
    );
  }

  getAssignations(
    studentId: number,
    historyId: number,
    params: NzTableQueryParams,
    search: FoulAssignation
  ): Observable<FoulAssignation[]> {
    let url = this.baseUrl + 'students/' + studentId + '/histories/' + historyId + '/assignations';
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
      if (search.period.id) queryParams += '&peridoId=' + search.period.id;

      if (search.foul.id) queryParams += '&foulId=' + search.foul.id;

      if (search.foul.numeral) queryParams += '&foulNumeral=' + search.foul.numeral;

      if (search.foul.foulsType) queryParams += '&foulsType=' + search.foul.foulsType;

      if (search.createdAt) queryParams += '&createdAt=' + search.createdAt.toISOString();

      if (search.createdEnd) queryParams += '&createdEnd=' + search.createdEnd.toISOString();

      if (search.issueDateStart) queryParams += '&issueDateStart=' + search.issueDateStart.toISOString();

      if (search.issueDateEnd) queryParams += '&issueDateEnd=' + search.issueDateEnd.toISOString();
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');

    url += queryParams;

    return this.http.get<FoulAssignation[]>(url).pipe(catchError(this.handleError));
  }

  saveAssignation(studentId: number, historyId: number, assignation: FoulAssignation): Observable<FoulAssignation> {
    let url = this.baseUrl + 'students/' + studentId + '/histories/' + historyId + '/assignations';

    const data = {
      issueDate: assignation.issueDate,
      periodIdAssignation: assignation.period.id,
      foulIdAssignation: assignation.foul.id,
      sanctionIdAssignation: assignation.sanction ? assignation.sanction.id : null
    };

    if (assignation.id) {
      url += '/' + assignation.id;
      return this.http.patch<FoulAssignation>(url, JSON.stringify(data)).pipe(catchError(this.handleError()));
    } else {
      return this.http.post<FoulAssignation>(url, JSON.stringify(data)).pipe(catchError(this.handleError()));
    }
  }

  deleteAssignation(studentId: number, historyId: number, assignationId: number): Observable<void> {
    const url = this.baseUrl + 'students/' + studentId + '/histories/' + historyId + '/assignations/' + assignationId;

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
