import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarRoutingModule } from './calendar-routing.module';

import {
  ScheduleModule,
  AgendaService,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService
} from '@syncfusion/ej2-angular-schedule';
import { AntDesignModule } from '../ant-design/ant-design.module';

import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RecurrenceEditorModule } from '@syncfusion/ej2-angular-schedule';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';

import { CalendarComponent } from './components/calendar/calendar.component';
import { CounselingRequestsComponent } from './components/counseling-requests/counseling-requests.component';

@NgModule({
  declarations: [CalendarComponent, UpcomingEventsComponent, CounselingRequestsComponent],
  providers: [AgendaService, DayService, WeekService, WorkWeekService, MonthService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarRoutingModule,
    DatePickerModule,
    AntDesignModule,
    ScheduleModule,
    DropDownListModule,
    DateTimePickerModule,
    RecurrenceEditorModule
  ]
})
export class CalendarModule {}
