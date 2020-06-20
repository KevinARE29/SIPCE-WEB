import { Component, OnInit } from '@angular/core';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
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
    private accessLogService: AccessLogService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init(){
    let currentDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    
    this.searchParams = new AccessLog();
    this.pagination = new Pagination();

    this.searchParams.attemptTime = [date, currentDate];
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  recharge(params: NzTableQueryParams): void{
    this.loading = true;
    this.accessLogService.searchAccessLog(params, this.searchParams, params.pageIndex !== this.pagination.page)
      .subscribe(
        data => {
          this.accessLogs = data['data'];
          this.pagination = data['pagination'];
          this.listOfDisplayData = [...this.accessLogs];
          this.loading = false;
        }, err => {          
          let statusCode = err.statusCode;
          let notIn = [401, 403];
          
          if(!notIn.includes(statusCode) && statusCode<500){
            this.notification.create(
              'error',
              'Ocurrió un error al recargar la bitácora de accesos.',
              err.message,
              { nzDuration: 0 }
            );
          }
        }
      )
  }

  search(): void{
    this.accessLogService.searchAccessLog(null, this.searchParams, false)
      .subscribe(
        data => {
          this.accessLogs = data['data'];
          this.pagination = data['pagination'];
          this.listOfDisplayData = [...this.accessLogs];
          this.loading = false;
        }, err => {          
          let statusCode = err.statusCode;
          let notIn = [401, 403];
          
          if(!notIn.includes(statusCode) && statusCode<500){
            this.notification.create(
              'error',
              'Ocurrió un error al filtrar la bitácora de accesos.',
              err.message,
              { nzDuration: 0 }
            );
          }
        }
      )
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
