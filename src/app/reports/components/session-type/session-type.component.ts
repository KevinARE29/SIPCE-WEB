import { Component, OnInit } from '@angular/core';

import { subMonths, differenceInCalendarDays } from 'date-fns';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ReportService } from '../../shared/report.service';

import { SessionTypes } from './../../../shared/enums/session-types.enum';

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
  listOfDisplayData: {
    counselor: string;
    count: number;
    cycle: string;
    grade: string;
    sessionType: string;
    shift: string;
  }[] = [];

  searchParams: {
    sessionType: string;
    shiftId: number;
    cycleId: number;
    gradeId: number;
    counselorId: number;
    dateRange: unknown;
  };
  type: string;
  sessionTypesList: string[];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.init();
    // this.listOfDisplayData = new Array<{
    //   counselor: string;
    //   count: number;
    //   cycle: string;
    //   grade: string;
    //   sessionType: string;
    //   shift: string;
    // }>();
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

    this.sessionTypesList = Object.keys(SessionTypes).filter((k) => isNaN(Number(k)));
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    this.searchParams.dateRange = [date, currentDate];
  }

  getData(params: NzTableQueryParams): void {
    this.reportService.mergeUserData(params, this.searchParams, 'session_type').subscribe((data) => {
      this.listOfDisplayData = [];
      this.listOfDisplayData = data['reportData']['data'];
      console.log(this.listOfDisplayData);
    });
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchParams.dateRange[0] = result[0];
    this.searchParams.dateRange[1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
}
