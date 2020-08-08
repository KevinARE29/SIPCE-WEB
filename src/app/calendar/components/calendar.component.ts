import { Component, OnInit, ViewChild } from '@angular/core';
import { Schedule, Day, Week, WorkWeek, Month } from '@syncfusion/ej2-schedule';
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
import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';
/*
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
      today: '',
      noEvents: 'Keine Ereignisse',
      emptyContainer: 'An diesem Tag sind keine Veranstaltungen geplant.',
      allDay: 'Den ganzen Tag',
      start: 'Start',
      end: 'Ende',
      more: 'Mehr',
      close: 'Schließen',
      cancel: 'Stornieren',
      noTitle: '(Kein Titel)',
      delete: 'Löschen',
      deleteEvent: 'Diese Veranstaltung',
      deleteMultipleEvent: 'Mehrere Ereignisse löschen',
      selectedItems: 'Elemente ausgewählt',
      deleteSeries: 'Ganze Serie',
      edit: 'Bearbeiten',
      editSeries: 'Ganze Serie',
      editEvent: 'Diese Veranstaltung',
      createEvent: 'Erstellen',
      subject: 'Gegenstand',
      addTitle: 'Titel hinzufügen',
      moreDetails: 'Mehr Details',
      save: 'speichern',
      editContent: 'Wie möchten Sie den Termin in der Serie ändern?',
      deleteContent: 'Möchten Sie diesen Termin wirklich löschen?',
      deleteMultipleContent: 'Möchten Sie die ausgewählten Ereignisse wirklich löschen?',
      newEvent: 'Neues Event',
      title: 'Titel',
      location: 'Ort',
      description: 'Beschreibung',
      timezone: 'Zeitzone',
      startTimezone: 'Starten Sie die Zeitzone',
      endTimezone: 'Zeitzone beenden',
      repeat: 'Wiederholen',
      saveButton: 'speichern',
      cancelButton: 'Stornieren',
      deleteButton: 'Löschen',
      recurrence: 'Wiederholung',
      wrongPattern: 'Das Wiederholungsmuster ist ungültig.',
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
      ok: 'In Ordnung',
      yes: 'Ja',
      no: 'Nein',
      occurrence: 'Auftreten',
      series: 'Serie',
      previous: 'Bisherige',
      next: 'Nächster',
      timelineDay: 'Timeline Day',
      timelineWeek: 'Timeline-Woche',
      timelineWorkWeek: 'Timeline Work Week',
      timelineMonth: 'Timeline-Monat',
      timelineYear: 'Timeline-Jahr',
      editFollowingEvent: 'Folge Veranstaltungen',
      deleteTitle: 'Ereignis löschen',
      editTitle: 'Ereignis bearbeiten',
      beginFrom: 'Beginnen Sie von',
      endAt: 'Ende um'
    },
    recurrenceeditor: {
      none: 'Keiner',
      daily: 'Täglich',
      weekly: 'Wöchentlich',
      monthly: 'Monatlich',
      month: 'Monat',
      yearly: 'Jährlich',
      never: 'noch nie',
      until: 'Bis um',
      count: 'Anzahl',
      first: 'Zuerst',
      second: 'Zweite',
      third: 'Dritte',
      fourth: 'Vierte',
      last: 'Zuletzt',
      repeat: 'Wiederholen',
      repeatEvery: 'Wiederhole jeden',
      on: 'Wiederholen Sie Ein',
      end: 'Ende',
      onDay: 'Tag',
      days: 'Tage)',
      weeks: 'Wochen)',
      months: 'Monat (e)',
      years: 'Jahre)',
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
      today: 'Heute'
    }
  }
});
*/
// setCulture('es');

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  // @ViewChild('schedule')
  // public scheduleObj: ScheduleComponent;

  public selectedDate: Date = new Date(2018, 1, 15);
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
      }
    ]
  };
  constructor() {}

  ngOnInit(): void {
    // this.scheduleObj.locale = 'es';
  }
}
