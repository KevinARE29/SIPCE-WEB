import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { SecurityPolicy } from '../../security-policies/shared/security-policy.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';

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

  updatePassword(data) {
    return this.httpClient.patch<any>(`${this.baseUrl}authgot-password`, data)
  }


}
