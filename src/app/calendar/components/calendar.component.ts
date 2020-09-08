import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  EventSettingsModel,
  ScheduleComponent,
  RecurrenceEditor,
  PopupOpenEventArgs,
  View
} from '@syncfusion/ej2-angular-schedule';

import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { L10n, loadCldr, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { RecurrenceEditorChangeEventArgs, EventRenderedArgs } from '@syncfusion/ej2-angular-schedule';

import { addDays, endOfMonth, getDay, startOfMonth, subDays } from 'date-fns';
import * as numberingSystems from '../../../../node_modules/cldr-data/supplemental/numberingSystems.json';
import * as gregorian from '../../../../node_modules/cldr-data/main/es/ca-gregorian.json';
import * as numbers from 'cldr-data/main/es/numbers.json';
import * as timeZoneNames from 'cldr-data/main/es/timeZoneNames.json';

import language from './../shared/calendar-language.json';
import { Events } from '../shared/events.model';
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
  event: Events;
  // Search variables
  searchLoader = false;
  searchLoaderUser = false;
  student: Student;
  user: User;
  results: Student[];
  resultsUsers: User[];
  noResults: string;
  searching = false;
  searchingUser = false;
  showAlert = false;

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  @ViewChild('recurrenceObj')
  public recurrenceObj: RecurrenceEditor;
  public views: Array<string> = ['Day', 'Week', 'Month'];
  public selectedDate: Date = new Date();
  public newViewMode: View = 'Month';
  private dataManager: DataManager = new DataManager({
    url: 'https://js.syncfusion.com/demos/ejservices/api/Schedule/LoadData',
    adaptor: new WebApiAdaptor(),
    crossDomain: true
  });

  public eventFields: Object = { text: 'eventTypeText', value: 'eventTypeText' };
  public EventData: Object[] = [
    { eventTypeText: 'Sesión con estudiante', Id: 1 },
    { eventTypeText: 'Entrevista con docente titular', Id: 2 },
    { eventTypeText: 'Entrevista con padres de familia', Id: 3 },
    { eventTypeText: 'Otros', Id: 4 }
  ];
  // define the JSON of data
  public formatData: Object[] = [
    { Id: 'Short', Label: 'Short' },
    { Id: 'Narrow', Label: 'Narrow' },
    { Id: 'Abbreviated', Label: 'Abbreviated' },
    { Id: 'Wide', Label: 'Wide' }
  ];

  /*
  allDayEvent(): void {
    console.log(this.show);
    this.show = !this.show;
  }
*/
  public dateParser(data: string): Date {
    return new Date(data);
  }

  public recurrenceParser(dataR: string) {
    //  const outputElement: HTMLElement = <HTMLElement>document.querySelector('#RecurrenceRule');
    //  if (args.value == '') {
    //    outputElement.innerText = null;
    //  } else {
    //    this.recurrenceRule = '"' + args.value + '"';
    // return new RecurrenceEditor({ value: dataR });
    //  const recurrObject: RecurrenceEditor = new RecurrenceEditor();
    //  recurrObject.appendTo(dataR);
    //  this.scheduleObj.setRecurrenceEditor(recurrObject);
    //  }
  }

  // public eventData: EventSettingsModel = {
  //   dataSource: this.dataManager,
  //   fields: {
  //     id: 'Id',
  //     subject: { validation: { required: true } },
  //     location: { validation: { required: true, regex: ['^[a-zA-Z0-9- ]*'] } },
  //     description: { validation: { required: true }},
  //     startTime: { validation: { required: true } },
  //     endTime: { validation: { required: true } }
  //   }
  // };

  public eventData: EventSettingsModel = {
    dataSource: [
      {
        Id: 1,
        Subject: 'Board Meeting',
        StartTime: new Date(2018, 10, 30, 9, 0),
        EndTime: new Date(2018, 10, 30, 11, 0),
        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;',
        EventType: 'Otros',
        Students: ['1'],
        CategoryColor: '#1fcfb5'
      },
      {
        Id: 2,
        Subject: 'Training session on JSP',
        StartTime: '2018-11-15T06:00:00.000Z',
        EndTime: '2018-11-15T06:00:00.000Z',
        IsAllDay: true
      },
      {
        Id: 3,
        Subject: 'Sprint Planning with Team members',
        StartTime: new Date(2018, 10, 30, 9, 30),
        EndTime: new Date(2018, 10, 30, 11, 0),
        CategoryColor: '#357cd2'
      },
      {
        Id: 3,
        Subject: 'Sprint Planning with Team members',
        StartTime: new Date(2018, 10, 21, 9, 30),
        EndTime: new Date(2018, 10, 22, 11, 0)
      }
    ],
    fields: {
      id: 'Id',
      subject: { validation: { required: [true, 'El título del evento es requerido'] } },
      startTime: { validation: { required: [true, 'La fecha de inicio del evento es requerida'] } },
      endTime: { validation: { required: [true, 'La fecha de fin del evento es requerida'] } }
    }
  };

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private studentService: StudentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      Id: [null, [Validators.required]],
      Subject: [null, [Validators.required, Validators.maxLength(128)]],
      EventType: [null, [Validators.required]],
      Location: [null, [Validators.required, Validators.maxLength(128)]],
      StartTime: [null, [Validators.required]],
      EndTime: [null, [Validators.required]],
      IsAllDay: [false, [Validators.required]],
      //  RecurrenceID: [null, [Validators.required]],
      RecurrenceRule: [null, [Validators.required]],
      Description: [null, [Validators.required]],
      //  RecurrenceException: [null, [Validators.required]],
      Users: [null, [Validators.required]],
      Students: [null, [Validators.required]]
    });

    this.student = new Student();
    this.user = new User();
    this.results = new Array<Student>();
    this.resultsUsers = new Array<User>();
    this.event = new Events();
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

  /* Method to show the recurrence rule with dataBinding
  onChange(args: RecurrenceEditorChangeEventArgs): void {
    const outputElement: HTMLElement = <HTMLElement>document.querySelector('#RecurrenceRule');
    if (args.value == '') {
      outputElement.innerText = null;
    } else {
     //  this.recurrenceRule = '"' + args.value + '"';
      this.recurrenceRule = args.value;
      console.log(this.recurrenceRule);
    }
  }*/

  public onChange(args: any): void {
    this.recurrenceRule = '';
    this.recurrenceRule = args.value;
    console.log();
  }

  public onBegin(args: any): void {
    if (args.requestType === 'eventChange' || args.requestType === 'eventCreate') {
      let data = !isNullOrUndefined(args.data[0]) ? args.data[0] : args.data;
      const createEvent = {};
      const participantIds = new Array<number>();
      data.RecurrenceRule = this.recurrenceRule;

      if (this.event.Users !== undefined) {
        this.event.Users.forEach((user) => {
          participantIds.push(user.id);
          console.log('participants Ids!!!!!!!!!!!!');
          console.log(participantIds);
        });
      } else {
        this.event.Users = null;
      }

      //initializing the event object that will be send to the json data
      this.event.Id = data.Id;
      this.event.StartTime = data.StartTime.toISOString();
      this.event.EndTime = data.EndTime.toISOString();
      this.event.Subject = data.Subject;
      this.event.EventType = data.EventType;
      this.event.IsAllDay = false;
      if (data.RecurrenceRule === undefined) {
        this.event.RecurrenceRule = null;
        createEvent['recurrent'] = false;
      } else {
        this.event.RecurrenceRule = data.RecurrenceRule;
        createEvent['recurrent'] = true;
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
      if (participantIds.length !== 0) createEvent['participantIds'] = participantIds;
      if (this.event.Students) createEvent['studentId'] = this.event.Students[0].id;

      if (args.requestType === 'eventCreate') {
        //   args.cancel = true;
        // this.submitForm();
        console.log('--------------');
        console.log('esto tiene el createEvent');
        console.log(createEvent);
        this.eventService.createAppointment(createEvent).subscribe(
          (r) => {
            console.log('--------------');
            console.log('esto devuelve la ruta');
            console.log(r);
            data = <any>args.data;
            //  args.cancel = false;
            // this.scheduleObj.addEvent(data);
          },
          (err) => {
            args.cancel = true;
            console.log(err);
          }
        );
        console.log('--------------');
        console.log('esto tiene el eventForm');
        console.log(this.eventForm.value);
        console.log('esto tiene el objeto de event !!!!');
        console.log(this.event);
        console.log('esto tiene data');
        console.log(data);
      } else if (args.requestType === 'eventChange') {
        console.log('--------------');
        data = <any>args.data;
        console.log(<any>args.data);
        console.log('esto tiene data');
        console.log(data);
      }
    }
  }

  onActionComplete(args): void {
    let startDate, endDate;

    if (args.requestType === 'dateNavigate') {
      const currentViewDates = this.scheduleObj.getCurrentViewDates();
      startDate = currentViewDates[0];
      endDate = currentViewDates[currentViewDates.length - 1];

      this.getEvents(startDate, endDate);
    } else if (args.requestType === 'toolBarItemRendered') {
      // Get the current month's start and end dates
      startDate = startOfMonth(this.selectedDate);
      endDate = endOfMonth(this.selectedDate);

      // Calculate the dates visible on the calendar
      startDate = subDays(startDate, getDay(startDate));
      endDate = addDays(endDate, 6 - getDay(endDate));

      this.getEvents(startDate, endDate);
    }
  }

  getEvents(startDate, endDate): void {
    this.eventService.getEvents(startDate, endDate).subscribe((data) => {
      console.log(data);
    });
  }

  submitForm(): void {
    if (this.eventForm.valid) {
      this.event.Id = this.eventForm.controls['Id'].value;
      this.event.Subject = this.eventForm.controls['Subject'].value;
      this.event.StartTime = this.eventForm.controls['StartTime'].value;
      this.event.EndTime = this.eventForm.controls['EndTime'].value;
      this.event.Location = this.eventForm.controls['Location'].value;
      this.event.RecurrenceRule = this.eventForm.controls['RecurrenceRule'].value;
      this.event.Description = this.eventForm.controls['Description'].value;
      // this.event.Users = this.eventForm.controls['Users'].value;
      // this.event.Students = this.eventForm.controls['Students'].value;
    }
    console.log(this.event);
    //  this.scheduleObj.addEvent(this.event);
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    this.eventForm.reset;
    this.event.Users = new Array<User>();
    for (const i in this.eventForm.controls) {
      this.eventForm.controls[i].markAsDirty();
      this.eventForm.controls[i].updateValueAndValidity();
    }
    this.results = new Array<Student>();
    this.resultsUsers = new Array<User>();
    this.event.Students = null;
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

  addStudent(Student: Student): void {
    //add condition to know if the event has students previously
    //add condition to know if the event has students previously
    this.event.Students = new Array<Student>();
    // if (this.event.Students.length === 0) {

    this.showAlert = true;
    console.log('entro');
    this.event.Students.push(Student);
    console.log(this.event.Students);
    //  this.StudentId = null;
    //  this.StudentId = Student.id;
    this.results = this.results.filter((d) => d['id'] !== Student.id);
    // } else {

    // }
  }

  confirmDeleteStudent(id: number, student: Student): void {
    this.showAlert = false;
    this.results.push(student);
    this.event.Students = this.event.Students.filter((d) => d['id'] !== id);
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
    // this.event.Users = new Array<User>();
    this.event.Users.push(User);
    console.log('esto guarda user');
    console.log(this.event.Users);
    this.resultsUsers = this.resultsUsers.filter((d) => d['id'] !== User.id);
  }

  confirmDeleteUser(id: number, user: User): void {
    this.resultsUsers.push(user);
    this.event.Users = this.event.Users.filter((d) => d['id'] !== id);
  }
}
