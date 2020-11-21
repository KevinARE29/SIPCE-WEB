import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { subMonths } from 'date-fns';

import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/users/shared/user.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl: string;

  constructor(private http: HttpClient, private userService: UserService) {
    this.baseUrl = environment.apiURL;
  }

  getSessionsReport(params: NzTableQueryParams, search: unknown, reportType: string): Observable<unknown> {
    let url = this.baseUrl + 'reporting/sessions';
    let queryParams = `?reportType=${reportType}`;

    // Sort params
    if (params) {
      let sort = '&sort=';
      params.sort.forEach((param) => {
        if (param.value) {
          sort += param.key;
          switch (param.value) {
            case 'ascend':
              sort += '-' + param.value.substring(0, 3) + ',';
              break;
            case 'descend':
              sort += '-' + param.value.substring(0, 4) + ',';
              break;
          }
        }
      });

      if (sort.length > 6) {
        if (sort.charAt(sort.length - 1) === ',') sort = sort.slice(0, -1);

        queryParams += sort;
      }
    }

    // Search params
    if (search) {
      if (search['sessionType']) queryParams += '&sessionType=' + search['sessionType'];

      if (search['shiftId']) queryParams += '&shiftId=' + search['shiftId'];

      if (search['cycleId']) queryParams += '&cycleId=' + search['cycleId'];

      if (search['gradeId']) queryParams += '&gradeId=' + search['gradeId'];

      if (search['counselorId']) queryParams += '&counselorId=' + search['counselorId'];

      if (search['dateRange'] && search['dateRange'][0] != undefined && search['dateRange'][1] != undefined) {
        queryParams +=
          '&startedAt=' + search['dateRange'][0].toISOString() + '&finishedAt=' + search['dateRange'][1].toISOString();
      } else {
        const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
        let date = subMonths(currentDate, 1);

        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

        queryParams += '&startedAt=' + date.toISOString() + '&finishedAt=' + currentDate.toISOString();
      }
    }

    url += queryParams;
    console.log(url);
    return this.http.get<unknown>(url);
  }

  mergeUserData(sort: NzTableQueryParams, searchParams: unknown, reportType: string): Observable<any> {
    return forkJoin({
      reportData: this.getSessionsReport(sort, searchParams, reportType),
      userProfile: this.userService.getUserProfile(),
      counselors: this.userService.getUsersByRole(4)
    });
  }
}
