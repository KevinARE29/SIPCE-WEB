import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../login/shared/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private tokenBeingRefreshed = false;
  private tokenRefreshSubject = new BehaviorSubject<string | null>(null);

  constructor(private router: Router, private authService: AuthService, private jwtHelper: JwtHelperService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url;

    if (url.includes('images')) {
      const newRequest = this.appendformData(request);
      return next.handle(newRequest);
    } else if (
      url.includes('login') ||
      url.includes('reset-password') ||
      url.includes('forgot-password') ||
      url.includes('counseling/requests')
    ) {
      const newRequest = this.appendContentType(request);
      return next.handle(newRequest);
    } else if (
      !url.includes('auth') ||
      url.includes('politics') ||
      url.includes('users') ||
      url.includes('roles') ||
      url.includes('permissions') ||
      url.includes('logout')
    ) {
      const newRequest = this.appendAccessToken(request);

      return next.handle(newRequest).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handleSessionExpiredError(request, next);
          }
          return throwError(error);
        })
      );
    }

    return next.handle(request);
  }

  private appendAccessToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('accessToken');

    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    return request;
  }

  private appendformData(request: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('accessToken');

    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  private appendContentType(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  handleSessionExpiredError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken') || '';
    const refresh = localStorage.getItem('refreshToken') || '';
    const tokenExpired = this.jwtHelper.isTokenExpired(accessToken);
    const refreshTokenExpired = this.jwtHelper.isTokenExpired(refresh);

    if (tokenExpired && !refreshTokenExpired) {
      if (!this.tokenBeingRefreshed) {
        this.tokenBeingRefreshed = true;
        this.tokenRefreshSubject.next(null);
        return this.authService.refreshToken().pipe(
          switchMap((jwtResponse) => {
            this.tokenBeingRefreshed = false;
            this.tokenRefreshSubject.next(jwtResponse.data.accessToken);
            const newRequest = this.appendAccessToken(request);
            return next.handle(newRequest);
          })
        );
      } else {
        return this.tokenRefreshSubject.pipe(
          filter((currentToken) => currentToken !== null),
          take(1),
          switchMap(() => {
            const newRequest = this.appendAccessToken(request);
            return next.handle(newRequest);
          })
        );
      }
    } else {
      localStorage.clear();
      this.router.navigate(['login/error401']);
      return next.handle(request);
    }
  }
}
