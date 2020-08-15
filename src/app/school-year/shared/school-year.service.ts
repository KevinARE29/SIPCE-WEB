/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { getYear } from 'date-fns';

import { SchoolYear } from './school-year.model';
import { SectionService } from 'src/app/manage-academic-catalogs/shared/section.service';
import { GradeService } from 'src/app/manage-academic-catalogs/shared/grade.service';
import { ShiftService } from 'src/app/manage-academic-catalogs/shared/shift.service';
import { CycleService } from 'src/app/manage-academic-catalogs/shared/cycle.service';
import { ErrorMessageService } from 'src/app/shared/error-message.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolYearService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private errorMessageService: ErrorMessageService,
    private sectionService: SectionService,
    private gradeService: GradeService,
    private cycleService: CycleService,
    private shiftService: ShiftService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getSchoolYear(): Observable<SchoolYear[]> {
    return this.http.get<SchoolYear>(`${this.baseUrl}academics/school-year`).pipe(
      map((r) => {
        const schoolYear = new SchoolYear();
        const previousSchoolYear = new SchoolYear();

        const response = r['currentAssignation'];
        const previousResponse = r['previousAssignation'];

        const schoolYears = new Array<SchoolYear>();

        if (response) {
          schoolYear.id = response.id;
          schoolYear.year = response.year;
          schoolYear.status = response.status;
          schoolYear.startDate = response.startDate;
          schoolYear.endDate = response.endDate;
          schoolYear.close = response.close;
          schoolYear.shifts = new Array<unknown>();

          if (response['cycleDetails']) {
            Object.entries(response['cycleDetails']).forEach(([key, value]) => {
              // Get shift
              const shift = {};
              shift['shift'] = value[0]['shift'];

              // Get cycles
              shift['shift']['cycles'] = new Array<unknown>();
              Object.entries(value).forEach(([key, value]) => {
                shift['shift']['cycles'].push(value);
              });

              // Add new entry
              schoolYear.shifts.push(shift);
            });
          }
        } else {
          schoolYear.status = 'En proceso de apertura';
        }

        if (previousResponse) {
          previousSchoolYear.id = previousResponse.id;
          previousSchoolYear.year = previousResponse.year;
          previousSchoolYear.status = previousResponse.status;
          previousSchoolYear.startDate = previousResponse.startDate;
          previousSchoolYear.endDate = previousResponse.endDate;
          previousSchoolYear.close = previousResponse.close;
          previousSchoolYear.shifts = new Array<unknown>();

          if (previousResponse['cycleDetails']) {
            Object.entries(previousResponse['cycleDetails']).forEach(([key, value]) => {
              // Get shift
              const shift = {};
              shift['shift'] = value[0]['shift'];

              // Get cycles
              shift['shift']['cycles'] = new Array<unknown>();
              Object.entries(value).forEach(([key, value]) => {
                shift['shift']['cycles'].push(value);
              });

              // Add new entry
              previousSchoolYear.shifts.push(shift);
            });
          }
        }

        schoolYears[0] = schoolYear;
        schoolYears[1] = previousSchoolYear;
        console.log(schoolYears);
        return schoolYears;
      })
    );
  }

  initializeSchoolYear(startDate: Date, endDate: Date): Observable<any> {
    const data = JSON.stringify({
      year: getYear(startDate),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    return this.http.post<void>(`${this.baseUrl}academics/school-year`, data).pipe(catchError(this.handleError()));
  }

  mergeSchoolYearAndCatalogs(): Observable<unknown> {
    return forkJoin({
      sections: this.sectionService.getAllSections(),
      grades: this.gradeService.getAllGrades(),
      cycles: this.cycleService.searchCycle(null, false),
      shifts: this.shiftService.getShifts(),
      schoolYear: this.getSchoolYear()
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   */
  private handleError() {
    return (error: any) => {
      error.error.message = this.errorMessageService.transformMessage('school-year', error.error.message);
      return throwError(error.error);
    };
  }
}
