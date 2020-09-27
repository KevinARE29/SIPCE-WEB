/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit, ViewChild } from '@angular/core';

import {
  EventSettingsModel,
  ScheduleComponent,
  RecurrenceEditor,
  PopupOpenEventArgs,
  View
} from '@syncfusion/ej2-angular-schedule';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { L10n, loadCldr, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { RecurrenceEditorChangeEventArgs, EventRenderedArgs } from '@syncfusion/ej2-angular-schedule';

import { addDays, addHours, endOfMonth, getDay, startOfMonth, subDays, compareDesc } from 'date-fns';
import * as numberingSystems from '../../../../node_modules/cldr-data/supplemental/numberingSystems.json';
import * as gregorian from '../../../../node_modules/cldr-data/main/es/ca-gregorian.json';
import * as numbers from 'cldr-data/main/es/numbers.json';
import * as timeZoneNames from 'cldr-data/main/es/timeZoneNames.json';
import { NzMessageService } from 'ng-zorro-antd/message';

import language from './../shared/calendar-language.json';
import { Appointment } from '../shared/appointment.model';
import { User } from '../../users/shared/user.model';
import { Student } from '../../students/shared/student.model';
import { StudentService } from '../../students/shared/student.service';
import { UserService } from '../../users/shared/user.service';
import { EventService } from '../shared/event.service';
loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);

L10n.load(language);

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  toolBarItemRendered = false;
  loading = false;
  recurrenceRule: string;
  show = true;
  event: Appointment;
  updateEvent: Appointment;

  // Search variables
  searchLoader = false;
  searchLoaderUser = false;
  student: Student;
  selectedStudent: Student[]; //BORRAR
  user: User;
  studentNie: string;
  username: string;
  results: Student[];
  resultsUsers: User[];
  noResults: string;
  searching = false;
  searchingUser = false;
  showAlert = false;
  //flag to know if the event can be saved
  saveEvent: boolean;
  startTimeDate: string; // quitar
  startDate: string;
  endDate: string;
  // Used in the custom validation
  formStartDate: Date;
  formEndDate: Date;

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  @ViewChild('recurrenceObj')
  public recurrenceObj: RecurrenceEditor;
  public views: Array<string> = ['Day', 'Week', 'Month'];
  public selectedDate: Date = new Date();
  public currentViewMode: View = 'Month';

  public eventFields: Object = { text: 'eventTypeText', value: 'eventTypeText' };
  public EventData: Object[] = [
    { eventTypeText: 'Sesión con estudiante', Id: 1 },
    { eventTypeText: 'Entrevista con docente titular', Id: 2 },
    { eventTypeText: 'Entrevista con padres de familia', Id: 3 },
    { eventTypeText: 'Programa de intervención', Id: 5 },
    { eventTypeText: 'Otro', Id: 4 }
  ];

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
        range: [this.customFn, 'El inicio del evento debe darse antes de la fecha de fin']
      }
    },
    endTime: {
      validation: {
        required: [true, 'La fecha de fin del evento es requerida'],
        range: [this.customFn, 'La fecha de fin debe ser posterior a la fecha de inicio']
      }
    }
  };

  public data: object[] = [];
  public eventData: EventSettingsModel = {
    dataSource: null,
    fields: this.eventFormFields
  };

  allDayEvent(): void {
    this.show = !this.show;
  }

  public dateParser(data: string): Date {
    return new Date(data);
  }

  constructor(
    private eventService: EventService,
    private studentService: StudentService,
    private userService: UserService,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.user = new User();
    this.results = new Array<Student>();
    this.resultsUsers = new Array<User>();
    this.event = new Appointment();
    this.updateEvent = new Appointment();
  }

  get getIsAllDay(): any {
    return true;
  }

  applyCategoryColor(args: EventRenderedArgs): void {
    const categoryColor: string = args.data.CategoryColor as string;
    if (!args.element || !categoryColor) {
      return;
    }
    if (this.scheduleObj.currentView === 'Agenda') {
      (args.element.firstChild as HTMLElement).style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  }

  onActionComplete(args): void {
    let startDate, endDate;

    switch (args.requestType) {
      case 'dateNavigate':
      case 'viewNavigate':
        const currentViewDates = this.scheduleObj.getCurrentViewDates();
        startDate = currentViewDates[0];
        endDate = currentViewDates[currentViewDates.length - 1];

        if (startDate === endDate) endDate = addHours(startDate, 24);

        this.getEvents(startDate, endDate);
        break;
      case 'toolBarItemRendered':
        // Avoid a second "initial get" if it's not the first load
        if (!this.toolBarItemRendered) {
          // Get the current month's start and end dates
          startDate = startOfMonth(this.selectedDate);
          endDate = endOfMonth(this.selectedDate);

          // Calculate the dates visible on the calendar
          startDate = subDays(startDate, getDay(startDate));
          endDate = addDays(endDate, 6 - getDay(endDate));

          this.getEvents(startDate, endDate);
        }
        break;
      case 'eventRemoved':
        if (args.changedRecords.length) {
          this.eventService.updateEventAfterDelete(args.changedRecords[0]).subscribe(() => {
            this.message.success(`El evento ha sido eliminado`);
          });
        }
        break;
      case 'eventChanged':
        if (args.changedRecords.length && args.addedRecords.length) {
          this.eventService.updateEvent(args.changedRecords[0], this.event).subscribe(() => {
            this.message.success(`La serie de eventos ha sido actualizada`);
          });

          this.eventService.createEvent(args.addedRecords[0], this.event).subscribe(() => {});
        }
        break;
    }
  }

  getEvents(startDate, endDate): void {
    this.loading = true;

    this.eventService.getEvents(startDate, endDate).subscribe((events) => {
      this.eventData = null;
      this.eventData = {
        dataSource: events,
        fields: this.eventFormFields
      };

      this.loading = false;
      if (!this.toolBarItemRendered) this.toolBarItemRendered = true;
    });
  }

  randomItem(): string {
    const items = ['#FB8500', '#023047', '#126782'];
    return items[Math.floor(Math.random() * items.length)];
  }

  public onChange(args: any): void {
    this.recurrenceRule = '';
    this.recurrenceRule = args.value;
  }

  public onBegin(args: any): void {
    if (args.requestType === 'eventCreate') {
      const data = !isNullOrUndefined(args.data[0]) ? args.data[0] : args.data;
      data.RecurrenceRule = this.recurrenceRule;
      args.cancel = true;

      if (data.EventType === undefined || data.EventType === null || data.EventType === '') data.EventType = 'Otro';

      this.eventService.createEvent(data, this.event).subscribe(
        (r) => {
          const nextIndex = Object.entries(this.eventData.dataSource).length;
          data.Id = r['data'].id;
          data.CategoryColor = this.randomItem();

          // Add the new event to the current data source
          Object.assign(this.eventData.dataSource, { [nextIndex]: data });

          // Refresh the calendar after adding a new event
          this.scheduleObj.refresh();

          this.event = new Appointment();
          this.message.success(`Evento creado con éxito`);
        },
        () => {
          args.cancel = true;
          this.event = new Appointment();
        }
      );
    } else if (args.requestType === 'eventChange') {
      if (!args.data.hasOwnProperty('parent')) {
        this.eventService.updateEvent(args.changedRecords[0], this.event).subscribe(() => {
          this.message.success(`El evento ha sido actualizado`);
        });
      }
    } else if (args.requestType === 'eventRemove') {
      if (!args.data[0].parent) {
        this.eventService.deleteEvent(args.data[0].Id).subscribe(() => {
          this.message.success(`El evento ha sido eliminado`);
        });
      }
    }
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    this.event.Participants = new Array<User>();
    this.updateEvent = new Appointment();
    this.selectedStudent = new Array<Student>();

    this.results = new Array<Student>();
    this.resultsUsers = new Array<User>();
    this.event.Student = null;
    this.showAlert = false;

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

      if (<any>args.data['Student']) this.event.Student = <any>args.data['Student'];
      if (<any>args.data['Participants']) this.event.Participants = <any>args.data['Participants'];

      document.getElementById('RecurrenceRule').style.display =
        this.scheduleObj.currentAction === 'EditOccurrence' ? 'none' : 'block';
    }
  }

  searchStudent(): void {
    const search = new Student();
    search.code = this.studentNie;

    this.searching = !this.searching;

    if (this.searching) {
      this.searchLoader = true;
      this.studentService.getStudents(null, search, true, null).subscribe((r) => {
        this.results = r['data'];
        this.searchLoader = false;
      });
    } else {
      this.results = new Array<Student>();
      this.studentNie = '';
    }
  }

  addStudent(selectedStudent: Student): void {
    this.event.Student = new Student();
    this.event.Student = selectedStudent;
    this.results = this.results.filter((d) => d['id'] !== selectedStudent.id);
  }

  confirmDeleteStudent(id: number, student: Student): void {
    this.showAlert = false;
    if (this.results.length !== 0) this.results.push(student);
    this.event.Student = null;
  }

  searchUser(): void {
    this.searchingUser = !this.searchingUser;

    if (this.searchingUser) {
      this.searchLoaderUser = true;
      this.userService.getUserByUsername(this.username).subscribe((r) => {
        this.resultsUsers = r['data'];
        this.resultsUsers = this.resultsUsers.filter((d) => d['id'] !== this.user.id);
        this.searchLoaderUser = false;
      });
    } else if (!this.searchingUser) {
      this.resultsUsers = new Array<User>();
      this.username = '';
    }
  }

  addUser(User: User): void {
    //add condition to know if the event has students previously
    this.event.Participants.push(User);
    this.resultsUsers = this.resultsUsers.filter((d) => d['id'] !== User.id);
  }

  confirmDeleteUser(id: number, user: User): void {
    if (this.resultsUsers.length !== 0) this.resultsUsers.push(user);
    this.event.Participants = this.event.Participants.filter((d) => d['id'] !== id);
  }
}
