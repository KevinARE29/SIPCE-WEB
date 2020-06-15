import { Component, OnInit } from '@angular/core';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { subMonths, differenceInCalendarDays } from 'date-fns';

import { ActionsLogService } from './../../shared/actions-log.service';
import { ActionLog } from './../../shared/action-log.model';
import { User } from './../../../shared/user.model';
import { Pagination } from './../../../shared/pagination.model';

@Component({
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
  styleUrls: ['./actions-log.component.css']
})
export class ActionsLogComponent implements OnInit {
  actionsLogs: ActionLog[];
  searchParams: ActionLog;
  listOfDisplayData: ActionLog[];
  loading = false;
  pagination: Pagination;
  tableSize = 'small'; 
  dateFormat = 'dd/MM/yyyy';

  constructor(
    private actionsLogService: ActionsLogService,
    private notification: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.searchParams = new ActionLog();
    this.searchParams.user = new User();

    this.pagination = new Pagination();
    this.getActionsLog();
  }

  getActionsLog(): void{
    this.loading = true;
    let currentDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    
    this.searchParams.attemptTime = [date, currentDate];

    this.actionsLogService.getActionsLog(currentDate).subscribe(
      data => {
        this.actionsLogs = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.actionsLogs];
        this.loading = false;
      }
    )
  }

  search(): void{}

  recharge(params: NzTableQueryParams): void{}

  onChangeDatePicker(result: Date[]): void {
    this.searchParams.attemptTime[0] = result[0];
    this.searchParams.attemptTime[1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
}
