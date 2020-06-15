import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { subMonths } from 'date-fns';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from '../../shared/error-message.service';
import { AccessLog } from './access-log.model';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getAccessLog(currentDate: any): Observable<AccessLog[]> {
    let url = this.baseUrl + 'logs/access-logs';
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    
    let queryParams = '?attemptTimeStart='+ date.toISOString() + '&attemptTimeEnd=' + currentDate.toISOString();

    url += queryParams;
    return this.http.get<AccessLog[]>(url)
      .pipe(
        catchError(this.handleError())
      );
  }

  searchAccessLog(params: NzTableQueryParams, search: AccessLog, paginate: boolean): Observable<AccessLog[]> {
    let url = this.baseUrl + 'logs/access-logs';
    let queryParams: string = '';

    // Paginate?
    if(paginate)
      queryParams += '?page=' + params.pageIndex;

    // Params
    if(params){
      let sort = '&sort=';
      params.sort.forEach(param => {
        if(param.value){
          sort += param.key;
          switch(param.value){
            case "ascend":
              sort += "-" + param.value.substring(0,3) + ',';
              break;
            case "descend":
              sort += "-" + param.value.substring(0,4) + ',';
              break;
          }
        }
      });

      if(sort.length>6){
        if(sort.charAt(sort.length-1)===',')
          sort = sort.slice(0, -1);

        queryParams += sort;
      }
    }

    // Search params
    if(search){
      if(search.username)
        queryParams += '&username=' + search.username;
      
      if(search.ip)
        queryParams += '&ip=' + search.ip;
      
      if(search.statusCode)
        queryParams += '&statusCode=' + search.statusCode;

      if(search.attemptTime && search.attemptTime[0] != undefined && search.attemptTime[1] != undefined){
        queryParams += '&attemptTimeStart=' + search.attemptTime[0].toISOString() + '&attemptTimeEnd=' + search.attemptTime[1].toISOString();
      } else{
        let currentDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate(), 23, 59, 59);
        let date = subMonths(currentDate, 1);

        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        
        queryParams += '&attemptTimeStart=' + date.toISOString() + '&attemptTimeEnd=' + currentDate.toISOString();
      }
    }
    
    if(queryParams.charAt(0)==='&')
      queryParams = queryParams.replace('&','?');
    
    url += queryParams;
    
    return this.http.get<AccessLog[]>(url)
      .pipe(
        catchError(this.handleError())
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage("access-log", error.error.message);
      return throwError(error.error);
    };
  }
}
