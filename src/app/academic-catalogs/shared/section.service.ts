import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ErrorMessageService } from '../../shared/error-message.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ShiftPeriodGrade } from './shiftPeriodGrade.model';
import { Student } from 'src/app/students/shared/student.model';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  updateSection(section: unknown): Observable<void> {
    return this.http
      .put<void>(`${this.baseUrl}academics/sections/${section['id']}`, JSON.stringify({ name: section['name'] }))
      .pipe(catchError(this.handleError()));
  }

  deleteSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}academics/sections/${id}`).pipe(catchError(this.handleError()));
  }

  createSection(name: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}academics/sections`, name).pipe(catchError(this.handleError()));
  }

  searchSection(params: NzTableQueryParams, paginate: boolean): Observable<ShiftPeriodGrade[]> {
    let url = this.baseUrl + 'academics/sections';
    let queryParams = '';

    if (paginate) queryParams += '&page=' + params.pageIndex;

    if (params) {
      if (params.sort[0].value) {
        queryParams += '&sort=' + params.sort[0].key;
        switch (params.sort[0].value) {
          case 'ascend':
            queryParams += '-' + params.sort[0].value.substring(0, 3);
            break;
          case 'descend':
            queryParams += '-' + params.sort[0].value.substring(0, 4);
            break;
        }
      }
    }

    if (queryParams.charAt(0) === '&') queryParams = queryParams.replace('&', '?');
    url += queryParams;

    return this.http.get<ShiftPeriodGrade[]>(url).pipe(catchError(this.handleError()));
  }

  getAllSections(): Observable<ShiftPeriodGrade[]> {
    return this.http
      .get<ShiftPeriodGrade[]>(`${this.baseUrl}academics/sections?paginate=false`)
      .pipe(catchError(this.handleError()));
  }

  getAllSectionStudents(sectionId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}academics/section-details/${sectionId}`).pipe(
      map((response) => {
        response['data'].students.forEach((student) => {
          student.selected = false;
        });
        return response['data'];
      }),
      catchError(this.handleError())
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('catalogs', error.error.message);
      return throwError(error.error);
    };
  }
}
