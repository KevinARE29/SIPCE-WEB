import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EventSettingsModel,
  ScheduleComponent,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService,
  AgendaService,
  View
} from '@syncfusion/ej2-angular-schedule';
// import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';
import { L10n, loadCldr } from '@syncfusion/ej2-base';

import * as numberingSystems from '../../../../node_modules/cldr-data/supplemental/numberingSystems.json';
import * as gregorian from '../../../../node_modules/cldr-data/main/es/ca-gregorian.json';
import * as numbers from 'cldr-data/main/es/numbers.json';
import * as timeZoneNames from 'cldr-data/main/es/timeZoneNames.json';

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
      emptyContainer: 'No hay datos que presentar ',
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
      selectedItems: 'Seleccionar elementos',
      deleteSeries: 'Eliminar series',
      edit: 'Editar',
      editSeries: 'Editar series',
      editEvent: 'Editar eventos',
      createEvent: 'Crear evento',
      subject: 'Asunto',
      addTitle: 'Agregar titulo',
      moreDetails: 'Mas detalles',
      save: 'Guardar',
      editContent: 'Realmente desea editar el contenido?',
      deleteContent: 'Realmente desea eliminar el contenido?',
      deleteMultipleContent: 'Realmente desea eliminar todos los eventos?',
      newEvent: 'Nuevo evento',
      title: 'Titulo',
      location: 'Localizacion',
      description: 'Descripcion',
      timezone: 'Zona horaria',
      startTimezone: 'Zona horaria de inicio',
      endTimezone: 'Zona horaria de fin',
      repeat: 'Repetir',
      saveButton: 'Guardar',
      cancelButton: 'Cancelar',
      deleteButton: 'Eliminar',
      recurrence: 'Recurrente',
      wrongPattern: 'Patron incorrecto.',
      seriesChangeAlert:
        'Möchten Sie die an bestimmten Instanzen dieser Serie vorgenommenen Änderungen verwerfen und erneut mit der gesamten Serie abgleichen?',
      createError:
        'Die Dauer des Ereignisses muss kürzer als die Häufigkeit sein, mit der es auftritt. Verkürzen Sie die Dauer oder ändern Sie das Wiederholungsmuster im Wiederholungsereignis-Editor.',
      sameDayAlert: 'Zwei Ereignisse desselben Ereignisses können nicht am selben Tag auftreten.',
      editRecurrence: 'Wiederholung bearbeiten',
      repeats: 'Wiederholt',
      alert: 'Warnen',
      startEndError: 'Das ausgewählte Enddatum liegt vor dem Startdatum.',
      invalidDateError: 'Der eingegebene Datumswert ist ungültig.',
      blockAlert: 'Ereignisse können nicht innerhalb des gesperrten Zeitbereichs geplant werden.',
      ok: 'ok',
      yes: 'si',
      no: 'no',
      occurrence: 'ocurrencia',
      series: 'Serie',
      previous: 'previo',
      next: 'Siguiente',
      timelineDay: '',
      timelineWeek: 'Timeline-Woche',
      timelineWorkWeek: 'Timeline Work Week',
      timelineMonth: 'Timeline-Monat',
      timelineYear: 'Timeline-Jahr',
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
      repeat: 'Frecuencia',
      repeatEvery: 'Repetir diario',
      on: 'en',
      end: 'fin',
      onDay: 'Tag',
      days: 'Dias',
      weeks: 'Semanas',
      months: 'Meses',
      years: 'Anipos',
      every: 'jeden',
      summaryTimes: 'mal)',
      summaryOn: 'auf',
      summaryUntil: 'bis um',
      summaryRepeat: 'Wiederholt',
      summaryDay: 'Tage)',
      summaryWeek: 'Wochen)',
      summaryMonth: 'Monat (e)',
      summaryYear: 'Jahre)',
      monthWeek: 'Monat Woche',
      monthPosition: 'Monatliche Position',
      monthExpander: 'Monats-Expander',
      yearExpander: 'Year Expander',
      repeatInterval: 'Wiederholungsintervall'
    },
    calendar: {
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
  // @ViewChild('schedule')
  // public scheduleObj: ScheduleComponent;

  public selectedDate: Date = new Date(2018, 10, 30);
  public newViewMode: View = 'Month';
  // public currentView: View = 'Month';

  public eventData: EventSettingsModel = {
    dataSource: [
      {
        Id: 1,
        Subject: 'Board Meeting',
        StartTime: new Date(2018, 10, 30, 9, 0),
        EndTime: new Date(2018, 10, 30, 11, 0)
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
    ]
  };
  constructor() {}

  ngOnInit(): void {
    // this.scheduleObj.locale = 'es';
  }
}
