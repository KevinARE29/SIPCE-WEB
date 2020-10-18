/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit, ViewChild } from '@angular/core';

import {
  EventSettingsModel,
  ScheduleComponent,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  PopupOpenEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { L10n } from '@syncfusion/ej2-base';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import language from './../../shared/calendar-language.json';
import { StudentService } from 'src/app/students/shared/student.service'; //TODO: Remove
import { Student } from 'src/app/students/shared/student.model';
import { Pagination } from 'src/app/shared/pagination.model';

L10n.load(language);

@Component({
  selector: 'app-counseling-requests',
  providers: [DayService, WeekService, WorkWeekService, MonthService],
  templateUrl: './counseling-requests.component.html',
  styleUrls: ['./counseling-requests.component.css']
})
export class CounselingRequestsComponent implements OnInit {
  // Events variables
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public eventSettings: EventSettingsModel = { dataSource: null };

  // Search / paginate / sort variables
  searchParams: Student;
  params: NzTableQueryParams;

  // Result variables
  loading = false;
  listOfDisplayData: Student[];
  pagination: Pagination;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.setDatePicker();

    this.getStudents();
    this.searchParams = new Student();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
    this.params = { pageIndex: this.pagination.page, pageSize: this.pagination.perPage, sort: null, filter: null };
    this.params.sort = [
      { key: 'firstname', value: null },
      { key: 'lastname', value: null },
      { key: 'email', value: null },
      { key: 'date', value: null }
    ];
  }

  setDatePicker(): void {
    new DateTimePicker({
      value: new Date(),
      locale: 'es'
    });
  }

  editor(name: string): void {
    const cellData: Object = { subject: name };
    this.scheduleObj.openEditor(cellData, 'Add');
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === 'Editor') {
      const startElement: HTMLInputElement = args.element.querySelector('#StartTime') as HTMLInputElement;
      if (!startElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker(
          {
            value: new Date(startElement.value) || new Date(),
            locale: 'es'
          },
          startElement
        );
      }
      const endElement: HTMLInputElement = args.element.querySelector('#EndTime') as HTMLInputElement;
      if (!endElement.classList.contains('e-datetimepicker')) {
        new DateTimePicker({ value: new Date(endElement.value) || new Date(), locale: 'es' }, endElement);
      }
    }
  }

  getStudents(): void {
    const paginate = this.params ? this.params.pageIndex !== this.pagination.page : false; // TODO: review
    this.loading = true;

    this.studentService.getStudents(this.params, this.searchParams, true, paginate).subscribe(
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
          // this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
          //   nzDuration: 30000
          // });
        }
      }
    );
  }

  updateParams(key: string): void {
    const currentParam = this.params.sort.find((x) => x.key === key);

    switch (currentParam.value) {
      case null:
        currentParam.value = 'ascend';
        break;
      case 'asc':
        currentParam.value = 'descend';
        break;
      case 'desc':
        currentParam.value = null;
        break;
    }

    this.getStudents();
  }

  paginate(page: number): void {
    console.log(page);
    this.params.pageIndex = page;
    this.getStudents();
  }
}
