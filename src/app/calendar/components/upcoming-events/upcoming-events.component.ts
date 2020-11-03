import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EventSettingsModel,
  ScheduleComponent,
  RecurrenceEditor,
  PopupOpenEventArgs,
  View
} from '@syncfusion/ej2-angular-schedule';
import { L10n, loadCldr, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { EventRenderedArgs } from '@syncfusion/ej2-angular-schedule';

import { addDays, addHours, endOfMonth, getDay, startOfMonth, subDays, compareDesc } from 'date-fns';
import * as numberingSystems from '../../../../../node_modules/cldr-data/supplemental/numberingSystems.json';
import * as gregorian from '../../../../../node_modules/cldr-data/main/es/ca-gregorian.json';
import * as numbers from 'cldr-data/main/es/numbers.json';
import * as timeZoneNames from 'cldr-data/main/es/timeZoneNames.json';
import { NzMessageService } from 'ng-zorro-antd/message';

import language from './../../shared/calendar-language.json';
import { Appointment } from '../../shared/appointment.model';

import { StudentService } from '../../../students/shared/student.service';
import { UserService } from '../../../users/shared/user.service';
import { EventService } from '../../shared/event.service';
import { add } from 'date-fns';

loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);

L10n.load(language);

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class UpcomingEventsComponent implements OnInit {
  loading = false;
  events: Appointment[];
  toolBarItemRendered = false;

  startDate: Date;
  tomorrowDate: Date;
  endDate: Date;

  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public views: Array<string> = ['Day'];
  public currentViewMode: View = 'Day';
  public selectedDate: Date = new Date();
  public minDate: Date;
  public maxDate: Date;

  public data: object[] = [];
  public eventData: EventSettingsModel = {
    dataSource: null
  };

  constructor(
    private eventService: EventService,
    private studentService: StudentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.events = new Array<Appointment>();
    this.tomorrowDate = new Date();
    this.tomorrowDate = add(new Date(), {
      days: 1
    });
    this.tomorrowDate.setHours(23);
    this.tomorrowDate.setMinutes(59);
    this.tomorrowDate.setSeconds(59);

    this.startDate = new Date();
    this.endDate = this.tomorrowDate;
    this.getEvents(this.startDate, this.endDate);
    console.log(this.startDate, 'hola este es la fecha de inicio en el upcoming events component');
    console.log(this.endDate, 'hola este es la fecha de fin upcoming events component');
    this.minDate = this.startDate;
    this.maxDate = this.endDate;
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

  getEvents(startDate: Date, endDate: Date): void {
    this.loading = true;
    console.log(startDate, endDate, '---fechas antes de ser enviadas--');
    this.eventService.getEvents(startDate, endDate).subscribe(
      (events) => {
        this.eventData = null;
        this.eventData = {
          dataSource: events
        };
        console.log(events, 'eventos en upcoming events');
        this.loading = false;
        if (!this.toolBarItemRendered) this.toolBarItemRendered = true;
      },
      () => {
        this.loading = false;
      }
    );
  }

  randomItem(): string {
    const items = ['#FB8500', '#023047', '#126782'];
    return items[Math.floor(Math.random() * items.length)];
  }
}
