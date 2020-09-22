import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class AcademicCatalogsService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getSchoolYear(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/v1/academics/school-year`);
  }
}
