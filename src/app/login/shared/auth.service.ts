import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { IJwtResponse } from '../jwt-response';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string;
  authSubject = new BehaviorSubject(false);
  decodedToken: any;
  expirationDate: string;
  loggedIn = new BehaviorSubject<boolean>(false);
  loggedOut = new BehaviorSubject<boolean>(true);

  constructor(private httpClient: HttpClient, private router: Router) {
    this.baseUrl = environment.apiURL;
  }

  login(user: { username: string; password: string }): Observable<IJwtResponse> {
    return this.httpClient.post<IJwtResponse>(`${this.baseUrl}auth/login`, user).pipe(
      tap((res: IJwtResponse) => {
        if (res) {
          // saving tokens
          this.saveToken(res.data.accessToken, res.data.exp, res.data.refreshToken);
        }
      })
    );
  }

  refreshToken(): Observable<IJwtResponse> {
    return this.httpClient
      .post<any>(`${this.baseUrl}auth/refresh-token`, {
        refreshToken: localStorage.getItem('refreshToken')
      })
      .pipe(
        tap((jwtResponse: IJwtResponse) => {
          this.saveToken(jwtResponse.data.accessToken, jwtResponse.data.exp, jwtResponse.data.refreshToken);
        })
      );
  }

  cleanLocalStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('refreshToken');
  }

  logout(): Observable<void> {
    return this.httpClient.delete(`${this.baseUrl}auth/logout`).pipe(
      map(() => {
        this.cleanLocalStorage();
      })
    );
  }

  saveToken(token: string, expiresIn: string, refreshToken: string): void {
    localStorage.clear();
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiresIn', expiresIn);
  }

  getToken(): string {
    return localStorage.getItem('accessToken');
  }

  jwtDecoder(myRawToken: string): any {
    const helper = new JwtHelperService();
    this.decodedToken = helper.decodeToken(myRawToken);
    return this.decodedToken;
  }
}
