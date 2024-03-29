import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Color, Label } from 'ng2-charts';
import { ChartDataSets } from 'chart.js';

import { environment } from './../../../environments/environment';

import { NgChart } from './chart.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl: string;
  colors = [
    '#EF6C00',
    '#EA4558',
    '#BE4685',
    '#7C5292',
    '#41537E',
    '#2F4858',
    '#001529',
    '#00415A',
    '#00727A',
    '#00A482',
    '#84D277',
    '#F9F871',
    '#00C6B9',
    '#2E3F56',
    '#DCF2FF'
  ];

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiURL;
  }

  getDashboard(): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}reporting/dashboard`).pipe(
      map((response) => {
        // Users by role
        const usersByRole = new NgChart();
        usersByRole.data = new Array<number>();
        usersByRole.labels = new Array<Label>();
        usersByRole.type = 'pie';
        usersByRole.legend = true;
        usersByRole.options = {
          responsive: true,
          legend: { position: 'left' }
        };
        usersByRole.colors = [{ backgroundColor: this.getColors() }];
        response['usersByRole'].forEach((role) => {
          usersByRole.labels.push(role['name']);
          usersByRole.data.push(role['count']);
        });

        // Students by status
        const studentsByStatus = new NgChart();
        studentsByStatus.data = new Array<number>();
        studentsByStatus.labels = new Array<Label>();
        studentsByStatus.type = 'pie';
        studentsByStatus.legend = true;
        studentsByStatus.options = {
          responsive: true,
          legend: { position: 'left' }
        };
        studentsByStatus.colors = [{ backgroundColor: this.getColors() }];
        response['studentsByStatus'].forEach((status) => {
          studentsByStatus.labels.push(status['status']);
          studentsByStatus.data.push(status['count']);
        });

        // Students by shift
        const studentsByShift = new NgChart();
        studentsByShift.data = new Array<number>();
        studentsByShift.labels = new Array<Label>();
        studentsByShift.type = 'pie';
        studentsByShift.legend = true;
        studentsByShift.options = {
          responsive: true,
          legend: { position: 'left' }
        };
        studentsByShift.colors = [{ backgroundColor: this.getColors() }];
        response['studentsByCurrentShift'].forEach((shift) => {
          studentsByShift.labels.push(shift['shiftName']);
          studentsByShift.data.push(shift['count']);
        });

        // Students by shift and grade
        const gradesArrays = new Array<unknown[]>();
        const studentsByShiftAndGrade = new NgChart();
        studentsByShiftAndGrade.datasets = new Array<ChartDataSets>();
        studentsByShiftAndGrade.labels = new Array<Label>();
        studentsByShiftAndGrade.type = 'horizontalBar';
        studentsByShiftAndGrade.legend = true;
        studentsByShiftAndGrade.options = {
          responsive: true,
          legend: { position: 'right' },
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        };
        response['studentsByCurrentShiftAndGrade'] = response['studentsByCurrentShiftAndGrade'].sort(
          (a, b) => a.gradeId - b.gradeId
        );

        // Get grades and shifts
        response['studentsByCurrentShiftAndGrade'].forEach((row) => {
          if (!studentsByShiftAndGrade.labels.includes(row.gradeName)) {
            studentsByShiftAndGrade.labels.push(row.gradeName);
            gradesArrays.push(response['studentsByCurrentShiftAndGrade'].filter((x) => x.gradeId === row.gradeId));
          }

          if (!studentsByShiftAndGrade.datasets.find((x) => x['label'] === row.shiftName))
            studentsByShiftAndGrade.datasets.push({ data: new Array<number>(), label: row.shiftName });
        });

        studentsByShiftAndGrade.colors = this.getBackgroundColors(studentsByShiftAndGrade.datasets.length);

        // Fill out datasets
        gradesArrays.forEach((row) => {
          studentsByShiftAndGrade.datasets.forEach((shift) => {
            const value = row.find((x) => x['shiftName'] === shift.label);
            value ? shift.data.push(value['count']) : shift.data.push(0);
          });
        });

        const page = {
          activeUsers: response['activeUsers'],
          totalStudents: response['totalStudents'],
          usersByRole,
          studentsByStatus,
          studentsByShiftAndGrade,
          studentsByShift
        };

        return page;
      }),
      catchError(this.handleError())
    );
  }

  getColors(): string[] {
    return this.colors;
  }

  getBackgroundColors(n: number): Color[] {
    const result = new Array(n);
    let len = this.colors.length;
    const taken = new Array(len);
    if (n > len) throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = { backgroundColor: this.colors[x in taken ? taken[x] : x] };
      taken[x] = --len in taken ? taken[len] : len;
    }

    return result;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error: any) => {
      return throwError(error.error);
    };
  }
}
