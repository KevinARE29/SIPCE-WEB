import { Component, OnInit } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { SchoolYearService } from '../../shared/school-year.service';

interface Section {
  id: number;
  name: string;
  teacher: string;
  closed: boolean;
}

interface Grade {
  id: number;
  name: string;
  expand: boolean;
  gradePercentage: number;
  sections: Section[];
}

interface Shift {
  id: number;
  name: string;
  shiftPercentage: number;
  grades: Grade[];
}

@Component({
  selector: 'app-school-year-end-summary',
  templateUrl: './school-year-end-summary.component.html',
  styleUrls: ['./school-year-end-summary.component.css']
})
export class SchoolYearEndSummaryComponent implements OnInit {
  data: unknown;
  shifts: Shift[] = [];
  expandSet = new Set<number>();
  btnLoading = false;

  constructor(
    private schoolYearService: SchoolYearService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.schoolYearService.getClosingStatus().subscribe((data) => {
      this.data = data;
      this.shifts = data['shifts'];
    });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  close(): void {
    this.btnLoading = true;
    this.schoolYearService.closeSchoolYear().subscribe(
      () => {
        this.btnLoading = false;
        this.message.success(`El año escolar ${this.data['year']} se ha cerrado con éxito`);

        window.location.reload();
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        this.btnLoading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al cerrar el año escolar.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
