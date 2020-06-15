import { Component, OnInit } from '@angular/core';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzDateMode } from 'ng-zorro-antd/date-picker';
import { subMonths, differenceInCalendarDays } from 'date-fns';

import { AccessLogService } from './../../shared/access-log.service';
import { AccessLog } from './../../shared/access-log.model';
import { Pagination } from './../../../shared/pagination.model';

@Component({
  selector: 'app-access-log',
  templateUrl: './access-log.component.html',
  styleUrls: ['./access-log.component.css']
})
export class AccessLogComponent implements OnInit {
  accessLogs: AccessLog[];
  searchParams: AccessLog;
  listOfDisplayData: AccessLog[];
  loading = false;
  pagination: Pagination;
  tableSize = 'small'; 
  dateFormat = 'dd/MM/yyyy';

  constructor(
    private accessLogService: AccessLogService
  ) { }

  ngOnInit(): void {
    this.searchParams = new AccessLog();
    this.pagination = new Pagination();
    this.getAccessLog();
  }

  getAccessLog(): void{
    this.loading = true;
    let currentDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    
    this.searchParams.attemptTime = [date, currentDate];

    this.accessLogService.getAccessLog(currentDate).subscribe(
      data => {
        this.accessLogs = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.accessLogs];
        this.loading = false;
      }
    )
  }

  recharge(params: NzTableQueryParams): void{
  }

  search(): void{
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchParams.attemptTime[0] = result[0];
    this.searchParams.attemptTime[1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
}
