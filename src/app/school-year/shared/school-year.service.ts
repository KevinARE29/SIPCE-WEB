/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { SchoolYear } from './school-year.model';
import { map } from 'rxjs/operators';
import { SectionService } from 'src/app/manage-academic-catalogs/shared/section.service';
import { GradeService } from 'src/app/manage-academic-catalogs/shared/grade.service';
import { ShiftService } from 'src/app/manage-academic-catalogs/shared/shift.service';
import { CycleService } from 'src/app/manage-academic-catalogs/shared/cycle.service';

@Injectable({
  providedIn: 'root'
})
export class SchoolYearService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private sectionService: SectionService,
    private gradeService: GradeService,
    private cycleService: CycleService,
    private shiftService: ShiftService
  ) {
    this.baseUrl = environment.apiURL;
  }

  getSchoolYear(): Observable<SchoolYear> {
    return this.http.get<SchoolYear>(`${this.baseUrl}academics/school-year`).pipe(
      map((r) => {
        const schoolYear = new SchoolYear();
        const response = r['currentAssignation'];

        schoolYear.id = response.id;
        schoolYear.year = response.year;
        schoolYear.status = response.status;
        schoolYear.startDate = response.startDate;
        schoolYear.endDate = response.endDate;
        schoolYear.close = response.close;
        schoolYear.shifts = new Array<unknown>();

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

        return schoolYear;
      })
    );
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
}
