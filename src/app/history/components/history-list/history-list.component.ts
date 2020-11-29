import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { UserService } from 'src/app/users/shared/user.service';
import { HistoryService } from '../../shared/history.service';
import { StudentWithHistory } from '../../shared/student-with-history.model';

class ShiftGradeSection {
  id: number;
  name: string;
  children?: ShiftGradeSection[];
}

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {
  loading = false;
  listOfDisplayData: StudentWithHistory[];

  // Search params
  searchParams: StudentWithHistory;
  pagination: Pagination;

  // Search lists
  loadingSearchLists = false;
  shifts: ShiftGradeSection[];
  grades: ShiftGradeSection[];
  sections: ShiftGradeSection[];

  constructor(
    private historyService: HistoryService,
    private notification: NzNotificationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.searchParams = new StudentWithHistory();
    this.searchParams.shift = new ShiftPeriodGrade();
    this.searchParams.grade = new ShiftPeriodGrade();
    this.searchParams.section = new ShiftPeriodGrade();

    this.shifts = new Array<ShiftGradeSection>();
    this.grades = new Array<ShiftGradeSection>();
    this.sections = new Array<ShiftGradeSection>();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    this.getSearchLists();
  }

  getSearchLists(): void {
    this.loadingSearchLists = true;

    this.userService.getUserProfile().subscribe((data) => {
      // If roles include "Docente" or "Docente Auxiliar", show only the sections assigned.
      if (
        (data['roles'] as unknown[]).some((role) => {
          return ['Docente', 'Docente Auxiliar'].includes(role['name']);
        })
      ) {
        if (data['teacherAssignation']) {
          (data['teacherAssignation'] as unknown[]).forEach((assigment) => {
            const shift: ShiftGradeSection = assigment['shift'];
            const grade: ShiftGradeSection = assigment['grade'];
            const section: ShiftGradeSection = assigment['section'];

            grade.children = [section];
            shift.children = [grade];

            this.shifts.push(shift);
          });
        }

        this.loadingSearchLists = false;
      }
    });
  }

  onChangeShift(shift: number): void {
    this.grades = shift ? this.shifts.find((x) => x.id === shift).children : new Array<ShiftGradeSection>();
    if (this.grades) this.grades.sort((a, b) => a.id - b.id);
    this.searchParams.grade.id = null;
    this.getHistory(null);
  }

  onChangeGrade(grade: number): void {
    this.sections = grade ? this.grades.find((x) => x.id === grade).children : new Array<ShiftGradeSection>();
    if (this.sections) this.sections.sort((a, b) => a.id - b.id);
    this.searchParams.section.id = null;
    this.getHistory(null);
  }

  getHistory(params: NzTableQueryParams): void {
    this.loading = true;

    this.historyService.getStudents(params, this.searchParams).subscribe(
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
}
