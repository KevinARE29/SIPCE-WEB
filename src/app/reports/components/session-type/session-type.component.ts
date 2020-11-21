import { Component, OnInit } from '@angular/core';

import * as XLSX from 'xlsx';
import { format, subMonths, differenceInCalendarDays } from 'date-fns';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { SessionTypes } from './../../../shared/enums/session-types.enum';

import { ReportService } from '../../shared/report.service';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { User } from 'src/app/users/shared/user.model';

export interface SessionsReport {
  sessionType: string;
  shiftId: number;
  cycleId: number;
  gradeId: number;
  counselorId: number;
  startedAt: unknown;
  finishedAt: unknown;
}

@Component({
  selector: 'app-session-type',
  templateUrl: './session-type.component.html',
  styleUrls: ['./session-type.component.css']
})
export class SessionTypeComponent implements OnInit {
  loading = false;
  listOfDisplayData: SessionsReport[];
  schoolYear: unknown;

  // Search
  searchParams: {
    sessionType: string;
    shiftId: number;
    cycleId: number;
    gradeId: number;
    counselorId: number;
    dateRange: unknown;
  };

  // Search lists
  shifts: ShiftPeriodGrade[];
  cycles: ShiftPeriodGrade[];
  grades: ShiftPeriodGrade[];
  counselors: User[];
  sessionTypesList: string[];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.init();
    this.getCatalogsData();
  }

  init(): void {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);

    this.searchParams = {
      sessionType: null,
      shiftId: null,
      cycleId: null,
      gradeId: null,
      counselorId: null,
      dateRange: null
    };

    this.shifts = new Array<ShiftPeriodGrade>();
    this.cycles = new Array<ShiftPeriodGrade>();
    this.grades = new Array<ShiftPeriodGrade>();
    this.counselors = new Array<User>();

    this.sessionTypesList = Object.keys(SessionTypes).filter((k) => isNaN(Number(k)));
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    this.searchParams.dateRange = [date, currentDate];
  }

  getCatalogsData(): void {
    this.reportService.mergeUserData().subscribe((data) => {
      this.schoolYear = data['assignation'][0];
      this.counselors = data['counselors']['data'];

      this.schoolYear['shifts'].forEach((shift) => {
        this.shifts.push({ id: shift.shift.id, name: shift.shift.name, active: shift.shift.active });
      });
    });
  }

  getSessionsReport(params: NzTableQueryParams): void {
    this.loading = true;

    this.reportService.getSessionsReport(params, this.searchParams, 'session_type').subscribe((data) => {
      this.listOfDisplayData = [];
      this.listOfDisplayData = data['data'];

      this.loading = false;
    });
  }

  cleanSelectors(type: string, id: number): void {
    switch (type) {
      case 'shift':
        this.searchParams.cycleId = null;

        this.cycles = id
          ? this.schoolYear['shifts'].find((x) => x['shift'].id === id)['shift']['cycles']
          : new Array<ShiftPeriodGrade>();
        break;
      case 'cycle':
        const cycles = this.schoolYear['shifts'].find((x) => x['shift'].id === id)['shift']['cycles'];

        this.grades = id ? cycles.find((x) => x['cycle'].id === id)['gradeDetails'] : new Array<ShiftPeriodGrade>();
        if (this.grades) this.grades.sort((a, b) => a.id - b.id);
        break;
    }

    this.searchParams.gradeId = null;

    this.getSessionsReport(null);
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchParams.dateRange[0] = result[0];
    this.searchParams.dateRange[1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  exportExcel(): void {
    const fileName = `Citas por tipo de sesión - ${format(new Date(), 'ddMMyyyyHHmmss')}.xlsx`;

    /* Table id is passed over here */
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* Generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Citas por tipo de sesión');

    /* Save to file */
    XLSX.writeFile(wb, fileName);
  }
}
