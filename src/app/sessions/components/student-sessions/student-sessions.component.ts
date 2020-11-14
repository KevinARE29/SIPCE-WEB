import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { subMonths, differenceInCalendarDays } from 'date-fns';

import { EventTypes } from './../../../shared/enums/event-types.enum';
import { Pagination } from 'src/app/shared/pagination.model';
import { Session } from '../../shared/session.model';


@Component({
  selector: 'app-student-sessions',
  templateUrl: './student-sessions.component.html',
  styleUrls: ['./student-sessions.component.css']
})
export class StudentSessionsComponent implements OnInit {

  // Param.
  studentId: number;

  searchSessionParams: Session;
  eventTypes: any;

  // Table variables
  loading = false;
  listOfDisplayData: Session[];
  pagination: Pagination;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    this.searchSessionParams = new Session();

    this.eventTypes = Object.keys(EventTypes).filter((k) => isNaN(Number(k)));

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    const param = this.route.snapshot.params['student'];

    if (typeof param === 'string' && !Number.isNaN(Number(param))) {
      this.studentId = Number(param);
    } 
  }

  getSessions(params): void {
    console.log(params);
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchSessionParams['registeredAt'][0] = result[0];
    this.searchSessionParams['registeredAt'][1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
}
