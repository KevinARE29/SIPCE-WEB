import { Component, OnInit } from '@angular/core';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

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
  listOfDisplayData: AccessLog[];
  loading = false;
  pagination: Pagination;
  tableSize = 'small'; 

  constructor(
    private accessLogService: AccessLogService
  ) { }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.getAccessLog();
  }

  getAccessLog(){
    this.loading = true;
    let currentDate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate(), 23, 59, 59);
    
    this.accessLogService.getAccessLog(currentDate).subscribe(
      data => {
        this.accessLogs = data['data'];
        this.pagination = data['pagination'];
        this.listOfDisplayData = [...this.accessLogs];
        this.loading = false;
      }
    )
  }

  recharge(params: NzTableQueryParams){

  }
}
