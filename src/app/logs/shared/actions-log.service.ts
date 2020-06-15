import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { subMonths } from 'date-fns';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from '../../shared/error-message.service';
import { ActionLog } from './action-log.model';
import { User } from './../../shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class ActionsLogService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getActionsLog(currentDate: any): Observable<ActionLog[]> {
    let url = this.baseUrl + 'logs/action-logs';
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    
    let queryParams = '?attemptTimeStart='+ date.toISOString() + '&attemptTimeEnd=' + currentDate.toISOString();

    url += queryParams;
    return this.http.get<ActionLog[]>(url)
      .pipe(
        catchError(this.handleError())
      );
  }

  searchAccessLog(params: NzTableQueryParams, search: ActionLog, paginate: boolean): Observable<ActionLog[]> {
    let url = this.baseUrl + 'logs/action-logs';
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
      if(search.user.username)
        queryParams += '&username=' + search.user.username;
      
      if(search.endpoint)
        queryParams += '&endpoint=' + search.endpoint;
      
      if(search.action)
        queryParams += '&action=' + search.action;

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

    return this.http.get<ActionLog[]>(url)
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
      error.error.message = this.errorMessageService.transformMessage("actions-log", error.error.message);
      return throwError(error.error);
    };
  }
}
