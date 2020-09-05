import { Component, OnInit, ViewChild } from '@angular/core';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { RecurrenceEditorChangeEventArgs, EventRenderedArgs } from '@syncfusion/ej2-angular-schedule';
import {
  EventSettingsModel,
  ScheduleComponent,
  RecurrenceEditor,
  PopupOpenEventArgs,
  View
} from '@syncfusion/ej2-angular-schedule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { L10n, loadCldr, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Events } from '../shared/events.model';

import * as numberingSystems from '../../../../node_modules/cldr-data/supplemental/numberingSystems.json';
import * as gregorian from '../../../../node_modules/cldr-data/main/es/ca-gregorian.json';
import * as numbers from 'cldr-data/main/es/numbers.json';
import * as timeZoneNames from 'cldr-data/main/es/timeZoneNames.json';
import { StudentService } from '../../students/shared/student.service';
import { Student } from '../../students/shared/student.model';

loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);

L10n.load({
  es: {
    schedule: {
      day: 'Dia',
      week: 'Semana',
      workWeek: 'Semana de trabajo',
      month: 'Mensual',
      agenda: 'Agenda',
      weekAgenda: 'Agenda semanal',
      workWeekAgenda: 'Semana de trabajo agenda',
      monthAgenda: 'Agenda mensual',
      today: 'Ahora',
      noEvents: 'No posee eventos',
      emptyContainer: 'No hay eventos que presentar en el calendario para este día',
      allDay: 'Todo el dia',
      start: 'Inicio',
      end: 'Fin',
      more: 'Mas',
      close: 'Cerrar',
      cancel: 'Cancelar',
      noTitle: 'No posee titulo',
      delete: 'Eliminar',
      deleteEvent: 'Eliminar evento',
      deleteMultipleEvent: 'Eliminar multiples eventos',
      selectedItems: 'Elementos seleccionados',
      deleteSeries: 'Eliminar series',
      edit: 'Editar',
      editSeries: 'Editar series',
      editEvent: 'Editar evento',
      createEvent: 'Crear evento',
      subject: 'Asunto',
      addTitle: 'Agregar titulo',
      moreDetails: 'Mas detalles',
      save: 'Guardar',
      editContent: 'Realmente desea editar el contenido?',
      deleteContent: 'Realmente desea eliminar el contenido?',
      deleteMultipleContent: 'Realmente desea eliminar todos los eventos?',
      newEvent: 'Nuevo evento',
      title: 'Título',
      location: 'Localización',
      description: 'Descripción',
      timezone: 'Zona horaria',
      startTimezone: 'Zona horaria de inicio',
      endTimezone: 'Zona horaria de fin',
      repeat: 'Repetir',
      saveButton: 'Guardar',
      cancelButton: 'Cancelar',
      deleteButton: 'Eliminar',
      recurrence: 'Recurrente',
      wrongPattern: 'El patrón de recurrencia es incorrecto.',
      seriesChangeAlert:
        'Los cambios realizados en instancias específicas de esta serie se cancelarán y esos eventos volverán a coincidir con la serie.',
      createError:
        'La duración del evento debe ser más corta que la frecuencia con la que ocurre. Acorte la duración o cambie el patrón de repetición en el editor de eventos de repetición',
      recurrenceDateValidation:
        'Algunos meses tienen menos de la fecha seleccionada. Para estos meses, la ocurrencia caerá en la última fecha del mes',
      sameDayAlert: 'No pueden ocurrir dos ocurrencias del mismo evento el mismo día.',
      editRecurrence: 'Editar recurrencia',
      repeats: 'Repite',
      alert: 'Alerta',
      startEndError: 'La fecha de finalización seleccionada se produce antes de la fecha de inicio',
      invalidDateError: 'La fecha ingresada es invalida',
      blockAlert: 'Espacio bloqueado',
      ok: 'ok',
      yes: 'si',
      no: 'no',
      occurrence: 'Ocurrencia',
      series: 'Series',
      previous: 'Previo',
      next: 'Siguiente',
      timelineDay: 'Línea de tiempo de dia',
      timelineWeek: 'Línea de tiempo semanal',
      timelineWorkWeek: 'Línea de tiempo semana de trabajo',
      timelineMonth: 'Línea de tiempo mensual',
      timelineYear: 'Línea de tiempo anual',
      editFollowingEvent: 'Editar los siguientes eventos',
      deleteTitle: 'Eliminar titulo',
      editTitle: 'Titulo de inicio',
      beginFrom: 'Iniciar en',
      endAt: 'Terminar en'
    },
    recurrenceeditor: {
      none: 'Ninguna',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      month: 'Mes',
      yearly: 'Anual',
      never: 'Nunca',
      until: 'Hasta',
      count: 'Cuenta',
      first: 'Primero',
      second: 'Segundo',
      third: 'Tercero',
      fourth: 'Cuarto',
      last: 'Ultimo',
      repeat: 'Repetir',
      repeatEvery: 'Repite cada',
      on: 'En',
      end: 'Dejar de repetir',
      onDay: 'En el dia',
      days: 'Dias',
      weeks: 'Semanas',
      months: 'Meses',
      years: 'Años',
      every: 'Cada',
      summaryTimes: 'veces',
      summaryOn: 'en',
      summaryUntil: 'hasta',
      summaryRepeat: 'Repite',
      summaryDay: 'dia(s)',
      summaryWeek: 'semana(s)',
      summaryMonth: 'mese(s)',
      summaryYear: 'año(s)',
      monthWeek: 'Mes laboral',
      monthPosition: 'Posicion del mes',
      monthExpander: 'expansor de mes',
      yearExpander: 'expansor anual',
      repeatInterval: 'Intervalo de repetición'
    },
    calendar: {
      today: 'Ahora'
    },
    datetimepicker: {
      placeholder: 'Seleccione la fecha y hora',
      today: 'Ahora'
    },
    datepicker: {
      placeholder: 'Seleccionar la fecha',
      today: 'Ahora'
    }
  }
});

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
  event: Events = new Events();
  // Search variables
  searchLoader = false;
  student: Student;
  results: Student[];
  noResults: string;
  searching = false;

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  @ViewChild('recurrenceObj')
  public recurrenceObj: RecurrenceEditor;
  public views: Array<string> = ['Day', 'Week', 'Month'];
  public selectedDate: Date = new Date(2018, 10, 30);
  public newViewMode: View = 'Month';
  private dataManager: DataManager = new DataManager({
    url: 'https://js.syncfusion.com/demos/ejservices/api/Schedule/LoadData',
    adaptor: new WebApiAdaptor(),
    crossDomain: true
  });

  public eventFields: Object = { text: 'eventTypeText', value: 'eventTypeText' };
  public EventData: Object[] = [
    { eventTypeText: 'Sesión estudiante', Id: 1 },
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
        Students: ['Vero']
      },
      {
        Id: 2,
        Subject: 'Training session on JSP',
        StartTime: new Date(2018, 10, 30, 15, 0),
        EndTime: new Date(2018, 10, 30, 17, 0)
      },
      {
        Id: 3,
        Subject: 'Sprint Planning with Team members',
        StartTime: new Date(2018, 10, 30, 9, 30),
        EndTime: new Date(2018, 10, 30, 11, 0)
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
      subject: { validation: { required: true } },
      location: { validation: { required: true, regex: ['^[a-zA-Z0-9- ]*'] } },
      startTime: { validation: { required: true } },
      endTime: { validation: { required: true } }
    }
  };

  constructor(private fb: FormBuilder, private studentService: StudentService) {}

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
    this.results = new Array<Student>();
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
      data.RecurrenceRule = this.recurrenceRule;
      console.log('esto tiene data');
      console.log(data);

      if (args.requestType === 'eventCreate') {
        this.submitForm();
        console.log('--------------');
        console.log('esto tiene el eventForm');
        console.log(this.eventForm.value);
        console.log('esto tiene el objeto de event');
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

  submitForm(): void {
    if (this.eventForm.valid) {
      this.event.Id = this.eventForm.controls['Id'].value;
      this.event.Subject = this.eventForm.controls['Subject'].value;
      this.event.StartTime = this.eventForm.controls['StartTime'].value;
      this.event.EndTime = this.eventForm.controls['EndTime'].value;
      this.event.Location = this.eventForm.controls['Location'].value;
      this.event.RecurrenceRule = this.eventForm.controls['RecurrenceRule'].value;
      this.event.Description = this.eventForm.controls['Description'].value;
      this.event.Users = this.eventForm.controls['Users'].value;
      this.event.Students = this.eventForm.controls['Students'].value;
    }
    // console.log(this.event);
    //  this.scheduleObj.addEvent(this.event);
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
    search.code = this.eventForm.controls['Users'].value;
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
      this.eventForm.get('Users')?.setValue(null);
    }
  }

  addStudent(Student: Student): void {
    console.log(Student.id);
    this.event.Students.push(Student.id);
    this.results = this.results.filter((d) => d['id'] !== Student.id);
  }
}
