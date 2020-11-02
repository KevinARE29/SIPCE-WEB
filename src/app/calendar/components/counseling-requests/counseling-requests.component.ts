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
import { compareDesc, subMonths, differenceInCalendarDays } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import language from './../../shared/calendar-language.json';
import { Student } from 'src/app/students/shared/student.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { UserService } from 'src/app/users/shared/user.service';
import { EventService } from '../../shared/event.service';
import { User } from 'src/app/logs/shared/user-log.model';
import { Appointment } from '../../shared/appointment.model';

L10n.load(language);

export interface Shift {
  id: number;
  name: string;
  grades: ShiftPeriodGrade[];
}

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
  shifts: Shift[];
  grades: ShiftPeriodGrade[];

  // Result variables
  loading = false;
  listOfDisplayData: { student: Student; counselingRequest: unknown }[] = [];
  pagination: Pagination;

  // Modals
  currentRequest: { student: Student; counselingRequest: unknown };
  isConfirmLoading = false;
  isVisible = false;
  confirmModal?: NzModalRef;

  // Used in the custom validation
  formStartDate: Date;
  formEndDate: Date;

  // Events
  public eventFields: Object = { text: 'eventTypeText', value: 'eventTypeText' };

  customFn: (args: { [key: string]: string }) => boolean = (args: { [key: string]: any }) => {
    const dateComponents = args.element.value.split('/');
    const yearTime = dateComponents[2].split(' ');
    const timeComponents = yearTime[1].split(':');

    dateComponents[2] = yearTime[0]; // Year

    if (args.element.name === 'StartTime') {
      this.formStartDate = new Date(
        dateComponents[2],
        dateComponents[1] - 1,
        dateComponents[0],
        timeComponents[0],
        timeComponents[1]
      );
      this.formEndDate = null;
    } else if (args.element.name === 'EndTime')
      this.formEndDate = new Date(
        dateComponents[2],
        dateComponents[1] - 1,
        dateComponents[0],
        timeComponents[0],
        timeComponents[1]
      );

    if (
      (args.element.name === 'StartTime' || args.element.name === 'EndTime') &&
      this.formStartDate &&
      this.formEndDate != null
    ) {
      return compareDesc(this.formStartDate, this.formEndDate) >= 0;
    } else {
      return true;
    }
  };

  public eventFormFields = {
    id: 'Id',
    subject: {
      validation: {
        required: [true, 'El título del evento es requerido'],
        regex: ['^[a-zA-Z0-9- ]*', 'El título debe contener unicamente letras y números']
      }
    },
    startTime: {
      validation: {
        required: [true, 'La fecha de inicio del evento es requerida'],
        range: [this.customFn, '']
      }
    },
    endTime: {
      validation: {
        required: [true, 'La fecha de fin del evento es requerida y debe ser posterior a la fecha de inicio'],
        range: [this.customFn, 'La fecha de fin debe ser posterior a la fecha de inicio']
      }
    }
  };

  public eventData: EventSettingsModel = {
    dataSource: null,
    fields: this.eventFormFields
  };

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.setDatePicker();
    this.init();
    this.getProfile();
  }

  init(): void {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    this.searchParams = new Student();
    this.searchParams['createdAt'] = [date, currentDate];
    this.searchParams.currentShift = new ShiftPeriodGrade();
    this.searchParams.grade = new ShiftPeriodGrade();
    this.searchParams.grade.id = null;

    this.pagination = new Pagination();
    this.shifts = new Array<Shift>();
    this.grades = new Array<ShiftPeriodGrade>();

    this.pagination.perPage = 12;
    this.pagination.page = 1;

    this.params = { pageIndex: this.pagination.page, pageSize: this.pagination.perPage, sort: null, filter: null };
    this.params.sort = [
      { key: 'code', value: null },
      { key: 'firstname', value: null },
      { key: 'lastname', value: null },
      { key: 'currentShift', value: null },
      { key: 'currentGrade', value: null },
      { key: 'createdAt', value: null }
    ];
  }

  setDatePicker(): void {
    new DateTimePicker({
      value: new Date(),
      locale: 'es'
    });
  }

  editor(): void {
    this.eventData = null;
    this.eventData = {
      dataSource: null,
      fields: this.eventFormFields
    };

    const cellData: Object = {
      subject: `Sesión con ${this.currentRequest['student']['firstname']} ${this.currentRequest['student']['lastname']}`
    };
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

      if (this.shifts.length) this.getCounselingRequests();
      this.loading = false;
    });
  }

  getCounselingRequests(): void {
    const paginate = this.params ? this.params.pageIndex !== this.pagination.page : false;
    this.params.pageSize = 12;
    this.loading = true;

    this.eventService.getCounselingRequests(this.params, this.searchParams, paginate).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = [];

        data['data'].forEach((req) => {
          const counselingRequest = {
            id: req.id,
            subject: req.subject,
            comment: req.comment,
            createdAt: req.createdAt
          };
          this.listOfDisplayData.push({ student: req['student'], counselingRequest });
        });

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

  updateParams(key: string): void {
    const currentParam = this.params.sort.find((x) => x.key === key);

    switch (currentParam.value) {
      case null:
        currentParam.value = 'ascend';
        break;
      case 'ascend':
        currentParam.value = 'descend';
        break;
      case 'descend':
        currentParam.value = null;
        break;
    }

    this.getCounselingRequests();
  }

  cleanGradesSelect(shift: number): void {
    this.grades = shift ? this.shifts.find((x) => x.id === shift).grades : new Array<ShiftPeriodGrade>();
    if (this.grades) this.grades.sort((a, b) => a.id - b.id);
    this.getCounselingRequests();
    this.searchParams.grade.id = null;
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchParams['createdAt'][0] = result[0];
    this.searchParams['createdAt'][1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  paginate(page: number): void {
    this.params.pageIndex = page;
    this.getCounselingRequests();
  }

  // Modal
  showModal(data: unknown): void {
    this.currentRequest = { student: data['student'], counselingRequest: data['counselingRequest'] };
    this.isVisible = true;
  }

  approve(): void {
    this.isVisible = false;
    this.editor();
  }

  reject(): void {
    this.isVisible = false;
    this.showConfirm();
  }

  close(): void {
    this.isVisible = false;
  }

  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea rechazar la solicitud de "${this.currentRequest.student.firstname} ${this.currentRequest.student.lastname}"?`,
      nzContent: `Eliminará la solicitud del listado. La acción no puede deshacerse.`,
      nzOnOk: () =>
        this.eventService
          .answerRequest(this.currentRequest.counselingRequest['id'], 'Cancelada')
          .toPromise()
          .then(() => {
            this.currentRequest = null;
            this.getCounselingRequests();
            this.message.success(`La solicitud ha sido eliminada`);
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            this.currentRequest = null;
            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar la solicitud.', err.message, {
                nzDuration: 30000
              });

              this.getCounselingRequests();
            }
          })
    });
  }

  public onBegin(args: any): void {
    if (args.requestType === 'eventCreate') {
      const calendarEvent = args.data[0];
      calendarEvent.EventType = 'Sesión con estudiante';
      calendarEvent.StartTime = calendarEvent.StartTime.toISOString();
      calendarEvent.EndTime = calendarEvent.EndTime.toISOString();

      const eventParticipants = new Appointment();
      eventParticipants.Student = this.currentRequest.student;
      eventParticipants.Participants = [];

      this.eventService.createEvent(calendarEvent, eventParticipants).subscribe(() => {
        this.eventService.answerRequest(this.currentRequest.counselingRequest['id'], 'Aceptada').subscribe(() => {
          this.currentRequest = null;
          this.getCounselingRequests();
          this.message.success(`La solicitud ha sido aprobada y un evento se ha creado en la agenda`);
        });
      });
    }
  }
}
