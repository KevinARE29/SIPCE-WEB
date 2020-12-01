import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { SociometricTestStatus } from './../../../shared/sociometric-test/sociometric-test-status.enum';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { SociometricTestService } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.service';
import { UserService } from 'src/app/users/shared/user.service';

@Component({
  selector: 'app-sociometric-tests',
  templateUrl: './sociometric-tests.component.html',
  styleUrls: ['./sociometric-tests.component.css']
})
export class SociometricTestsComponent implements OnInit {
  loading = false;
  filtersLoading = false;
  listOfDisplayData: unknown[];

  pagination: Pagination;
  searchParams: { shiftId: number; gradeId: number; sectionId: number; status: string; current: boolean };

  // Filters
  shifts: {
    id: number;
    name: string;
    grades: { id: number; name: string; sections: ShiftPeriodGrade[] }[];
  }[] = [];
  grades: unknown[];
  sections: ShiftPeriodGrade[];
  status: string[];

  // Modal
  confirmModal?: NzModalRef;

  constructor(
    private sociometricTestService: SociometricTestService,
    private userService: UserService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    this.searchParams = { shiftId: null, gradeId: null, sectionId: null, status: null, current: true };

    this.getFilters();
  }

  getFilters(): void {
    this.filtersLoading = true;

    this.status = Object.values(SociometricTestStatus).filter((k) => isNaN(Number(k)));

    this.userService.getUserProfile().subscribe((data) => {
      this.filtersLoading = false;
      const counselorAssignation = data['counselorAssignation'];

      if (counselorAssignation) {
        Object.values(counselorAssignation).forEach((assignation) => {
          const grades = new Array<{ id: number; name: string; sections: ShiftPeriodGrade[] }>();
          assignation[0]['gradeDetails'].forEach((grade) => {
            let sections = new Array<ShiftPeriodGrade>();

            grade.sectionDetails.forEach((section) => {
              sections.push(section.section);
            });

            sections = sections.sort((a, b) => a.id - b.id);
            sections = sections.filter((x) => x.name.length === 1).concat(sections.filter((x) => x.name.length > 1));
            grades.push({ id: grade.grade.id, name: grade.grade.name, sections: sections });
          });

          this.shifts.push({ id: assignation[0]['shift'].id, name: assignation[0]['shift'].name, grades });
        });
      }
    });
  }

  getTests(params: NzTableQueryParams): void {
    const paginate = params ? params.pageIndex !== this.pagination.page : false;
    this.loading = true;

    this.sociometricTestService.getSociometricTests(params, this.searchParams, paginate).subscribe(
      (data) => {
        this.listOfDisplayData = data['data'];
        console.log(this.listOfDisplayData);
        this.pagination = data['pagination'];
        this.loading = false;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];
        this.loading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener las pruebas sociométricas.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
