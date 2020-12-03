import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { UserService } from 'src/app/users/shared/user.service';
import { SessionService } from '../../../shared/session.service';

import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { Session } from '../../../shared/session.model';
import { StudentWithSessions } from '../../../shared/student-with-sessions.model';

export interface ISessions {
  student: StudentWithSessions;
  session: Session;
}
export interface Shift {
  id: number;
  name: string;
  grades: ShiftPeriodGrade[];
}
@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  // Search params
  searchParams: StudentWithSessions;
  shifts: Shift[];
  grades: ShiftPeriodGrade[];

  // Table variables
  loading = false;
  listOfDisplayData: StudentWithSessions[];
  pagination: Pagination;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.init();
    this.getProfile();
  }

  init(): void {
    this.searchParams = new StudentWithSessions();
    this.searchParams.shift = new ShiftPeriodGrade();
    this.searchParams.grade = new ShiftPeriodGrade();

    this.shifts = new Array<Shift>();
    this.grades = new Array<ShiftPeriodGrade>();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  getProfile(): void {
    this.loading = true;

    this.userService.getUserProfile().subscribe((data) => {
      if (data['counselorAssignation']) {
        Object.values(data['counselorAssignation']).forEach((assignation) => {
          const grades = new Array<ShiftPeriodGrade>();
          assignation[0]['gradeDetails'].forEach((grade) => {
            grades.push(grade.grade);
          });

          this.shifts.push({ id: assignation[0]['shift'].id, name: assignation[0]['shift'].name, grades });
        });
      }
    });
  }

  getSessions(params: NzTableQueryParams): void {
    this.loading = true;

    this.sessionService.getSessions(params, this.searchParams).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'];

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

  cleanGradesSelect(shift: number): void {
    this.grades = shift ? this.shifts.find((x) => x.id === shift).grades : new Array<ShiftPeriodGrade>();
    if (this.grades) this.grades.sort((a, b) => a.id - b.id);
    this.getSessions(null);
    this.searchParams.grade.id = null;
  }
}
