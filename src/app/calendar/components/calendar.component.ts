/* eslint-disable @typescript-eslint/ban-types */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  EventSettingsModel,
  ScheduleComponent,
  RecurrenceEditor,
  PopupOpenEventArgs,
  View
} from '@syncfusion/ej2-angular-schedule';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormValidator } from '@syncfusion/ej2-inputs';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { L10n, loadCldr, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { RecurrenceEditorChangeEventArgs, EventRenderedArgs } from '@syncfusion/ej2-angular-schedule';

import { addDays, endOfMonth, getDay, startOfMonth, subDays, compareAsc } from 'date-fns';
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
  recurrenceRule: string;
  eventForm!: FormGroup;
  IsAllDay = true;
  show = true;
  event: Appointment;
  updateEvent: Appointment;
  // Search variables
  searchLoader = false;
  searchLoaderUser = false;
  student: Student;
  selectedStudent: Student[];
  user: User;
  results: Student[];
  resultsUsers: User[];
  noResults: string;
  searching = false;
  searchingUser = false;
  showAlert = false;
  //flag to know if the event can be saved
  saveEvent: boolean;
  startTimeDate: string;

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  @ViewChild('recurrenceObj')
  public recurrenceObj: RecurrenceEditor;
  public views: Array<string> = ['Day', 'Week', 'Month'];
  public selectedDate: Date = new Date();
  public newViewMode: View = 'Month';

  public eventFields: Object = { text: 'eventTypeText', value: 'eventTypeText' };
  public EventData: Object[] = [
    { eventTypeText: 'Sesión con estudiante', Id: 1 },
    { eventTypeText: 'Entrevista con docente titular', Id: 2 },
    { eventTypeText: 'Entrevista con padres de familia', Id: 3 },
    { eventTypeText: 'Programa de intervención', Id: 5 },
    { eventTypeText: 'Otro', Id: 4 }
  ];

  public data: object[] = [];
  public eventData: EventSettingsModel;

  allDayEvent(): void {
    console.log(this.show);
    console.log(this.eventForm.value);
    this.show = !this.show;
  }

  public dateParser(data: string): Date {
    return new Date(data);
  }

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private studentService: StudentService,
    private userService: UserService,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      IsAllDay: [false, [Validators.required]],
      //  RecurrenceID: [null, [Validators.required]],
      RecurrenceRule: [null, [Validators.required]],
      //  RecurrenceException: [null, [Validators.required]],
      Users: [null, [Validators.required]],
      Students: [null, [Validators.required]]
    });

    this.student = new Student();
    this.user = new User();
    this.results = new Array<Student>();
    this.resultsUsers = new Array<User>();
    this.event = new Appointment();
    this.updateEvent = new Appointment();
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
        const currentViewDates = this.scheduleObj.getCurrentViewDates();
        startDate = currentViewDates[0];
        endDate = currentViewDates[currentViewDates.length - 1];

        this.getEvents(startDate, endDate);
        break;
      case 'toolBarItemRendered':
        // Get the current month's start and end dates
        startDate = startOfMonth(this.selectedDate);
        endDate = endOfMonth(this.selectedDate);

        // Calculate the dates visible on the calendar
        startDate = subDays(startDate, getDay(startDate));
        endDate = addDays(endDate, 6 - getDay(endDate));

        this.getEvents(startDate, endDate);
        break;
      case 'eventRemoved':
        if (args.changedRecords.length) {
          this.eventService.updateEvent(args.changedRecords[0]).subscribe(() => {
            this.message.success(`El evento ha sido eliminado`);
          });
        }
        break;
    }
  }

  getEvents(startDate, endDate): void {
    this.eventService.getEvents(startDate, endDate).subscribe((events) => {
      this.eventData = {
        dataSource: events,
        fields: {
          id: 'Id',
          subject: {
            validation: {
              required: [true, 'El título del evento es requerido'],
              regex: ['^[a-zA-Z0-9- ]*', 'El título debe contener unicamente letras y números']
            }
          },
          startTime: { validation: { required: [true, 'La fecha de inicio del evento es requerida'] } },
          endTime: { validation: { required: [true, 'La fecha de fin del evento es requerida'] } }
        }
      };
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
    if (args.requestType === 'eventChange' || args.requestType === 'eventCreate') {
      let data = !isNullOrUndefined(args.data[0]) ? args.data[0] : args.data;
      const createEvent = {};
      const participantIds = new Array<number>();
      this.saveEvent = true;
      data.RecurrenceRule = this.recurrenceRule;


      if (this.event.Participant !== undefined) {
        this.event.Participant.forEach((user) => {
          participantIds.push(user.id);
          console.log('participants Ids!!!!!!!!!!!!');
          console.log(participantIds);
        });
      } else {
        this.event.Participant = null;
      }

      //initializing the event object that will be send to the json data
      this.event.Id = data.Id;
      //console.log(data.StartTime);
      if (args.requestType === 'eventCreate') {
        this.event.StartTime = data.StartTime.toISOString();
        this.event.EndTime = data.EndTime.toISOString();
      } else if (args.requestType === 'eventChange') {
        // data.StartTime = this.startTimeDate;
        //data.StartTime = this.updateEvent.StartTime.toISOString();
        console.log('actualizar evento FECHA INICIO');
        console.log('--------------');
        this.event.StartTime = data.StartTime.toISOString();
        this.event.EndTime = data.EndTime.toISOString();
      }

      this.event.Subject = data.Subject;
      this.event.IsAllDay = false;
      if (data.RecurrenceRule === undefined || data.RecurrenceRule === null) {
        this.event.RecurrenceRule = null;
        createEvent['recurrent'] = false;
      } else {
        this.event.RecurrenceRule = data.RecurrenceRule;
        createEvent['recurrent'] = true;
      }

      if (data.EventType === undefined || data.EventType === null || data.EventType === '') {
        this.event.EventType = 'Otro';
      } else {
        this.event.EventType = data.EventType;
      }

      if (data.Location === undefined) {
        this.event.Location = null;
      } else {
        this.event.Location = data.Location;
      }

      if (data.Description === undefined) {
        console.log('entro al undefined');
        this.event.Description = null;
        console.log(this.event.Description);
      } else {
        this.event.Description = data.Description;
      }

      //initializing the event object that will be send to the backend
      createEvent['eventType'] = this.event.EventType;
      createEvent['day'] = this.event.StartTime;
      createEvent['startTime'] = this.event.StartTime;
      createEvent['endTime'] = this.event.EndTime;
      createEvent['subject'] = this.event.Subject;
      createEvent['description'] = this.event.Description;
      createEvent['jsonData'] = this.event;
      createEvent['jsonData']['CategoryColor'] = this.randomItem();
      if (participantIds.length !== 0) createEvent['participantIds'] = participantIds;
      console.log('event.students.id');
//      console.log(this.selectedStudent[0]);
      console.log('selected estudiante');
      console.log('------this.event.Student.id;---------');

      if (this.event.Student === null || this.event.Student === undefined) {

      } else {
          createEvent['studentId'] = this.event.Student.id;
      }

      if (args.requestType === 'eventCreate') {
        //validating the date
        const result = compareAsc(data.StartTime, data.EndTime);
        console.log(result);
        if (result === 1) {
          this.notification.create(
            'error',
            'Ocurrió un error al crear el evento. Por favor verifique lo siguiente:',
            'La fecha y hora de finalizacíon debe ser mayor a la fecha y hora de inicio',
            { nzDuration: 4500 }
          );
          this.saveEvent = false;
          args.cancel = true;
          console.log('La fecha de inicio debe ser menor a la fecha de fin');
        }
        args.cancel = true;
        // this.submitForm();
        console.log('--------------');
        console.log('esto tiene el createEvent');
        console.log(createEvent);
        if (this.saveEvent) {
          this.eventService.createAppointment(createEvent).subscribe(
            (r) => {
              args.cancel = false;
              console.log('--------------');
              console.log('esto devuelve la ruta', r);

              data = <any>args.data;
              this.data.push(data);

              // Refresh the calendar after adding a new event
              this.scheduleObj.refresh();
              // this.ngOnInit();
              console.log(this.data);
              this.event = new Appointment();
              // this.message.success(`Evento creado con éxito`);
              //  args.cancel = false;
              // this.scheduleObj.addEvent(data);
            },
            (err) => {
              args.cancel = true;
              console.log(err, this.data);
              this.event = new Appointment();
            }
          );
        }
        console.log('--------------');
        console.log('esto tiene el eventForm');
        console.log(this.eventForm.value);
        console.log('esto tiene el objeto de event !!!!');
        console.log(this.event);
        console.log('esto tiene data');
        console.log(data);
      } else if (args.requestType === 'eventChange') {
        console.log('actualizar evento');
        console.log('--------------');
        if (!args.data.parent) {
          // create event
          args.cancel = true;
          console.log('parent');
          console.log(<any>args.data);
          console.log('esto tiene data');
          console.log(args.data);
          this.eventService.updateEvent(args.data).subscribe(
            (r) => {
              args.cancel = false;
              console.log('ocurrence');
              data = <any>args.data;
              // this.updateEvent = new Events();
              console.log('esto tiene la ruta', r);
              this.message.success('Evento actualizado con éxito');
              this.scheduleObj.refresh();
            },
            (err) => {
              args.cancel = true;
            }
          );
        } else {
          this.eventService.updateEvent(args.data.occurrence).subscribe(
            (r) => {
              console.log('ocurrence');
              data = <any>args.data;
              this.updateEvent = new Appointment();
              console.log('esto tiene la ruta', r);
              // this.scheduleObj.refresh();
            },
            (err) => {
              args.cancel = true;
            }
          );
        }

        console.log(<any>args.data);
        console.log('esto tiene data');
        console.log(args.data.occurrence);
      }
      //delete event actions
    } else if (args.requestType === 'eventRemove') {
      if (!args.data[0].parent) {
        this.eventService.deleteEvent(args.data[0].Id).subscribe(() => {
          this.message.success(`El evento ha sido eliminado`);
        });
      }
    }
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    this.eventForm.reset;
    // cleanning variables of atendees
    this.event.Participant = new Array<User>();
    this.event.Student = new Student();
    this.updateEvent = new Appointment();
    this.selectedStudent = new Array<Student>();

    for (const i in this.eventForm.controls) {
      this.eventForm.controls[i].markAsDirty();
      this.eventForm.controls[i].updateValueAndValidity();
    }
    this.results = new Array<Student>();
    this.resultsUsers = new Array<User>();
    this.event.Student = null;
    this.showAlert = false;
    //initializing event object
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
      console.log('args.data en popun');
      console.log(args.data);
    
      /*
      const recurElement: HTMLElement = args.element.querySelector('#RecurrenceEditor');
      if (!recurElement.classList.contains('e-recurrenceeditor')) {
        this.recurrenceObj.appendTo(recurElement);
        this.scheduleObj.setRecurrenceEditor(this.recurrenceObj);
        (this.scheduleObj.eventWindow as any).recurrenceEditor = this.recurrenceObj;
        console.log(this.recurrenceObj.value);
      }
      */

      //  const recurElement: HTMLElement = args.element.querySelector('#RecurrenceEditor');
      // if (!recurElement.classList.contains('e-recurrenceeditor')) {
      //   const recurrObject: RecurrenceEditor = new RecurrenceEditor({
      //   value: 'FREQ=DAILY;INTERVAL=1;',
      //    locale: 'es'
      //  });
      //  recurrObject.appendTo(recurElement);
      //  this.scheduleObj.setRecurrenceEditor(recurrObject);
      //    this.scheduleObj.eventWindow.recurrenceEditor = recurrObject;
      //  (this.scheduleObj.eventWindow as any).recurrenceEditor = recurrObject;
      //  console.log(recurrObject);
      //  }
      document.getElementById('RecurrenceRule').style.display =
        this.scheduleObj.currentAction === 'EditOccurrence' ? 'none' : 'block';
    }
  }

  searchStudent(): void {
    const search = new Student();
    search.code = '';
    search.code = this.eventForm.controls['Students'].value;
    this.searching = !this.searching;

    if (search.code !== this.student.code && this.searching) {
      this.searchLoader = true;
      this.studentService.getStudents(null, search, true, null).subscribe((r) => {
        this.results = r['data'];
        this.results = this.results.filter((d) => d['id'] !== this.student.id);
        this.searchLoader = false;
      });
    } else if (!this.searching) {
      this.results = new Array<Student>();
      this.eventForm.get('Students')?.setValue(null);
    }
  }

  addStudent(SelectedStudent: Student): void {
    //add condition to know if the event has students previously
    this.event.Student = this.student;
    this.selectedStudent = new Array<Student>();
    // if (this.event.Students.length === 0) {
    this.selectedStudent.push(SelectedStudent);
    console.log(this.selectedStudent);
    //Saving the student to the event object
    this.showAlert = true;
    console.log('entro');
    this.event.Student = SelectedStudent;
    console.log(this.event.Student);
    this.results = this.results.filter((d) => d['id'] !== SelectedStudent.id);
  }

  confirmDeleteStudent(id: number, student: Student): void {
    this.showAlert = false;
    if (this.results.length !== 0) this.results.push(student);
    this.event.Student = this.student;
    this.selectedStudent = this.selectedStudent.filter((d) => d['id'] !== id);
  }

  searchUser(): void {
    let search = '';
    search = this.eventForm.controls['Users'].value;
    console.log(search);
    this.searchingUser = !this.searchingUser;

    if (this.searchingUser) {
      this.searchLoaderUser = true;
      this.userService.getUserByUsername(search).subscribe((r) => {
        this.resultsUsers = r['data'];
        console.log(this.resultsUsers);
        this.resultsUsers = this.resultsUsers.filter((d) => d['id'] !== this.user.id);
        this.searchLoaderUser = false;
      });
    } else if (!this.searchingUser) {
      this.resultsUsers = new Array<User>();
      this.eventForm.get('Users')?.setValue(null);
    }
  }

  addUser(User: User): void {
    //add condition to know if the event has students previously
    this.event.Participant.push(User);
    console.log('esto guarda user');
    console.log(this.event.Participant);
    this.resultsUsers = this.resultsUsers.filter((d) => d['id'] !== User.id);
  }

  confirmDeleteUser(id: number, user: User): void {
    if (this.resultsUsers.length !== 0) this.resultsUsers.push(user);
    this.event.Participant = this.event.Participant.filter((d) => d['id'] !== id);
  }
}
