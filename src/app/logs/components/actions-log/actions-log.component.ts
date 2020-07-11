import { Component, OnInit } from '@angular/core';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { subMonths, differenceInCalendarDays } from 'date-fns';

import { ActionsLogService } from './../../shared/actions-log.service';
import { ActionLog } from './../../shared/action-log.model';
import { User } from '../../shared/user-log.model';
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

  constructor(private actionsLogService: ActionsLogService, private notification: NzNotificationService) {}

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    this.searchParams = new ActionLog();
    this.searchParams.user = new User();
    this.pagination = new Pagination();

    this.searchParams.attemptTime = [date, currentDate];
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  search(): void {
    this.loading = true;
    this.actionsLogService.searchAccessLog(null, this.searchParams, false).subscribe(
      (data) => {
        this.actionsLogs = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.actionsLogs];
        this.loading = false;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrío un error al filtrar la bitácora de acciones.', err.message, {
            nzDuration: 0
          });
        }
      }
    );
  }

  recharge(params: NzTableQueryParams): void {
    this.loading = true;
    this.actionsLogService
      .searchAccessLog(params, this.searchParams, params.pageIndex !== this.pagination.page)
      .subscribe(
        (data) => {
          this.actionsLogs = data['data'];
          this.pagination = data['pagination'];
          this.listOfDisplayData = [...this.actionsLogs];
          this.loading = false;
        },
        (err) => {
          const statusCode = err.statusCode;
          const notIn = [401, 403];

          if (!notIn.includes(statusCode) && statusCode < 500) {
            this.notification.create('error', 'Ocurrío un error al recargar la bitácora de acciones.', err.message, {
              nzDuration: 0
            });
          }
        }
      );
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchParams.attemptTime[0] = result[0];
    this.searchParams.attemptTime[1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
}
