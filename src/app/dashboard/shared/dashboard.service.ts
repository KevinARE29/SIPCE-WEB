import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Label } from 'ng2-charts';

import { environment } from './../../../environments/environment';
import { ErrorMessageService } from 'src/app/shared/error-message.service';

import { NgChart } from './chart.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl: string;

  constructor(private http: HttpClient, private errorMessageService: ErrorMessageService) {
    this.baseUrl = environment.apiURL;
  }

  getDashboard(): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}reporting/dashboard`).pipe(
      map((response) => {

        // Roles
        const usersByRole = new NgChart();
        usersByRole.data = new Array<number>();
        usersByRole.labels = new Array<Label>();
        usersByRole.type = 'pie';
        usersByRole.legend = true;
        usersByRole.options = { responsive: true, legend: { position: 'left' } };
        response['usersByRole'].forEach((role) => {
          usersByRole.labels.push(role['name']);
          usersByRole.data.push(role['count']);
        });

        // Students
        const studentsByStatus = new NgChart();
        studentsByStatus.data = new Array<number>();
        studentsByStatus.labels = new Array<Label>();
        studentsByStatus.type = 'pie';
        studentsByStatus.legend = true;
        studentsByStatus.options = { responsive: true, legend: { position: 'left' } };
        response['studentsByStatus'].forEach((status) => {
          studentsByStatus.labels.push(status['status']);
          studentsByStatus.data.push(status['count']);
        });

        const page = {
          activeUsers: response['activeUsers'],
          totalStudents: response['totalStudents'],
          usersByRole: usersByRole,
          studentsByStatus: studentsByStatus,
          studentsByCurrentShiftAndGrade: [],
          studentsByCurrentShift: []
        };

        console.log(response);
        return page;
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
      // error.error.message = this.errorMessageService.transformMessage('dashboard', error.error.message);
      return throwError(error.error);
    };
  }
}
