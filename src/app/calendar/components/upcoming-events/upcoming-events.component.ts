import { Component, OnInit, ViewChild } from '@angular/core';
import { EventSettingsModel, ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule';
import { L10n, loadCldr } from '@syncfusion/ej2-base';

import { EventRenderedArgs } from '@syncfusion/ej2-angular-schedule';

import * as numberingSystems from '../../../../../node_modules/cldr-data/supplemental/numberingSystems.json';
import * as gregorian from '../../../../../node_modules/cldr-data/main/es/ca-gregorian.json';
import * as numbers from 'cldr-data/main/es/numbers.json';
import * as timeZoneNames from 'cldr-data/main/es/timeZoneNames.json';

import language from './../../shared/calendar-language.json';
import { Appointment } from '../../shared/appointment.model';

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
  maxDateCalendar: Date;
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
    allowAdding: false,
    allowEditing: false,
    allowDeleting: false,
    dataSource: null
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events = new Array<Appointment>();
    //Getting tomorrow date and setting the hour to 23:59:59
    this.tomorrowDate = new Date();
    this.tomorrowDate = add(new Date(), {
      days: 2
    });
    this.tomorrowDate.setHours(0);
    this.tomorrowDate.setMinutes(0);
    this.tomorrowDate.setSeconds(0);

    this.maxDateCalendar = add(new Date(), {
      days: 1
    });

    this.startDate = new Date();
    this.endDate = this.tomorrowDate;
    this.getEvents(this.startDate, this.endDate);
    this.minDate = this.startDate;
    this.maxDate = this.maxDateCalendar;
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
    this.eventService.getEvents(startDate, endDate).subscribe(
      (events) => {
        this.eventData = null;
        this.eventData = {
          dataSource: events
        };
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
