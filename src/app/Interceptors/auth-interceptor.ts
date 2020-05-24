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

    constructor(
        private router: Router,
        private authService: AuthService,
        private jwtHelper: JwtHelperService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        const url = request.url;
        if (!url.includes('auth') || url.includes('politics')) {
            const newRequest = this.appendAccessToken(request);
            return next.handle(newRequest).pipe(
                catchError((error) => {
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        return this.handleSessionExpiredError(request, next);
                    }
                    return throwError(error);
                })
            );
        } else if (url.includes('logout')) {
            const newRequest = this.appendAccessToken(request);
            return next.handle(newRequest);
        }
        return next.handle(request);
    }
    /* Method to append access token to the header of the request */
    private appendAccessToken(request: HttpRequest<any>): HttpRequest<any> {
        // mensajes informativos
        console.log('entro al appenAccessToken');
        const token1 = localStorage.getItem('accessToken');
        const accessTokenExpired = this.jwtHelper.isTokenExpired(token1);
        console.log('accesstoken expiro si o no', accessTokenExpired);

        const token = localStorage.getItem('accessToken');
        console.log('accessToken que se va en el header', token);
        if (token) {
            return request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`),
            });
        }
        return request;
    }

    handleSessionExpiredError(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const accessToken = localStorage.getItem('accessToken') || '';
        const refresh = localStorage.getItem('refreshToken') || '';
        const tokenExpired = this.jwtHelper.isTokenExpired(accessToken);
        console.log('expiro el accesstoken?', tokenExpired);
        const refreshTokenExpired = this.jwtHelper.isTokenExpired(refresh);
        console.log('expiro el refreshtoken?', refreshTokenExpired);
        if (tokenExpired && !refreshTokenExpired) {
            if (!this.tokenBeingRefreshed) {
                this.tokenBeingRefreshed = true;
                this.tokenRefreshSubject.next(null);
                return this.authService.refreshToken().pipe(
                    switchMap((jwtResponse) => {
                        console.log('se trata de consumir la ruta de refreshToken');
                        this.tokenBeingRefreshed = false;
                        this.tokenRefreshSubject.next(jwtResponse.data.accessToken);
                        console.log('resultado de consumir la ruta de refreshToken: access token', jwtResponse.data.accessToken);
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
            console.log('ambos token han expirado y se cierra la sesion');
            this.router.navigate(['/login']);
            console.log('ambos token vencieron');
            return next.handle(request);
        }
    }
}
