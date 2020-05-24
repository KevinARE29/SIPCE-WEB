import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { IJwtResponse } from '../jwt-response';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";


@Injectable({
	providedIn: 'root'
})
export class AuthService {
	helper = new JwtHelperService();
	baseUrl: string;
	authSubject = new BehaviorSubject(false);
	headers: HttpHeaders;
	decodedToken: any;
	expirationDate: string;
	loggedIn = new BehaviorSubject<boolean>(false);
	loggedOut = new BehaviorSubject<boolean>(true);

	constructor(private httpClient: HttpClient, private router: Router) {
		this.baseUrl = environment.apiUrl;
		this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
	}

	login(user: { username: string; password: string }): Observable<IJwtResponse> {
		return this.httpClient
			.post<IJwtResponse>(`${this.baseUrl}/auth/login/`, user, {
				headers: this.headers
			})
			.pipe(
				tap((res: IJwtResponse) => {
					if (res) {
						// guardar token
						this.saveToken(res.data.accessToken, res.data.exp, res.data.refreshToken);
						console.log('esto tiene la IJWTResponse');
						console.log(res.data);
					}
				})
			);
	}

	refreshToken() {
		return this.httpClient.post<any>(`${this.baseUrl}/auth/refresh-token`, {
			'refreshToken': localStorage.getItem('refreshToken')
		}).pipe(tap((jwtResponse: IJwtResponse) => {
			this.saveToken(jwtResponse.data.accessToken, jwtResponse.data.exp, jwtResponse.data.refreshToken);
		}
		))
	}

	cleanLocalStorage() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('expiresIn');
		localStorage.removeItem('refreshToken');
	}

	logout(): Observable<any> {
		// let headersLogOut: HttpHeaders;
		// headersLogOut = new HttpHeaders({
		// 	'Content-Type': 'application/json',
		// 	'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
		// });
		//{ headers: headersLogOut }
		// console.log('este es el header');
		return this.httpClient.delete(`${this.baseUrl}/auth/logout/`).pipe(
			map((resp) => {
				this.cleanLocalStorage();
			}
			))
	}

	saveToken(token: string, expiresIn: string, refreshToken: string): void {
		localStorage.clear();
		localStorage.setItem('accessToken', token);
		localStorage.setItem('refreshToken', refreshToken);
		localStorage.setItem('expiresIn', expiresIn);
	}

	getToken() {
		return localStorage.getItem('accessToken');
	}

	jwtDecoder(myRawToken: string) {
		this.decodedToken = this.helper.decodeToken(myRawToken);
		return this.decodedToken;
	}

}
