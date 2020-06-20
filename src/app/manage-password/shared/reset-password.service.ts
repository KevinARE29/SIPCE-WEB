import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.apiURL;
  }

  forgotPassword(email) {
    return this.httpClient.post<any>(`${this.baseUrl}auth/forgot-password`, email)
  }

}
