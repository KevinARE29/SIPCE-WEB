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
import language from './../../shared/calendar-language.json';

L10n.load(language);

@Component({
  selector: 'app-counseling-requests',
  providers: [DayService, WeekService, WorkWeekService, MonthService],
  templateUrl: './counseling-requests.component.html',
  styleUrls: ['./counseling-requests.component.css']
})
export class CounselingRequestsComponent implements OnInit {
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;
  public eventSettings: EventSettingsModel = { dataSource: null };
  recurrenceRule: string;

  constructor() {}

  ngOnInit(): void {
    this.setDatePicker();
  }

  setDatePicker(): void {
    new DateTimePicker({
      value: new Date(),
      locale: 'es'
    });
  }

  editor(): void {
    const cellData: Object = {};
    // console.log(args);
    this.scheduleObj.openEditor(cellData, 'Add');
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
    // this.showAlert = false;

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

      document.getElementById('RecurrenceRule').style.display =
        this.scheduleObj.currentAction === 'EditOccurrence' ? 'none' : 'block';
    }
  }

  public onChange(args: any): void {
    this.recurrenceRule = args.value;
  }
}
