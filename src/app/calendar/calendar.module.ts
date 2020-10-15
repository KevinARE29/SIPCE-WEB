import { NgModule } from '@angular/core';
import {
  ScheduleModule,
  AgendaService,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService
} from '@syncfusion/ej2-angular-schedule';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CalendarRoutingModule } from './calendar-routing.module';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { CalendarComponent } from './components/calendar.component';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RecurrenceEditorModule } from '@syncfusion/ej2-angular-schedule';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { CounselingRequestsComponent } from './components/counseling-requests/counseling-requests.component';

@NgModule({
  declarations: [CalendarComponent, CounselingRequestsComponent],
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
