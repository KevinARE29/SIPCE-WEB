import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { subMonths, differenceInCalendarDays } from 'date-fns';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { SessionService } from '../../shared/session.service';

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
  expedientId: number;

  searchSessionParams: Session;
  eventTypes: string[];

  // Table variables
  loading = false;
  listOfDisplayData: Session[];
  pagination: Pagination;

  // Modal to create.
  showModal: boolean = false;
  createEventType: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private notification: NzNotificationService
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

    const paramExpedient = this.route.snapshot.params['expedient'];
    if (typeof paramExpedient === 'string' && !Number.isNaN(Number(paramExpedient))) {
      this.expedientId = Number(paramExpedient);
    }

    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }
  }

  getSessions(params): void {
    this.loading = true;

    this.sessionService.getStudentSessions(this.studentId, this.expedientId, params, this.searchSessionParams).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data']['sessions'];

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchSessionParams.startedAt = result[0];
    this.searchSessionParams.finishedAt = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  setShowModal(showModal: boolean): void {
    this.showModal = showModal;
  }

  createSession(): void {
    if (this.createEventType) {
      this.router.navigate([this.createEventType], {relativeTo: this.route});
    }
  }
}
