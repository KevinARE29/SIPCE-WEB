import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from './../../../environments/environment';
import { AppPermission } from './app-permission.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiURL;
  }

  getPermissions(): Observable<AppPermission[]> {
    return this.http.get<AppPermission[]>(`${this.baseUrl}auth/permissions`);
  }
}
