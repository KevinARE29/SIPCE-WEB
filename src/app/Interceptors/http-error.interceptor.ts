/* 
  Path: app/interceptors/http-error.interceptor.ts
  Objetive: Handle the http errors
  Author: Esme López 
*/

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error instanceof HttpErrorResponse) {
          if(error.error.StatusCode === 401){
            this.router.navigate(['login/error401']);
          } else if( error.error.StatusCode === 403){
            this.router.navigate(['login/error403']);
          } else if(error.error.StatusCode >= 500 && error.error.StatusCode <= 599){
            this.router.navigate(['login/error500']);
          } 
          return throwError(error); // server-side error
        } else {
          return throwError(error); // client-side error
        }
      })
    );
  }

}
