import { NgModule } from '@angular/core';
import {
  ScheduleModule,
  AgendaService,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService
} from '@syncfusion/ej2-angular-schedule';
import { CalendarRoutingModule } from './calendar-routing.module';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { CalendarComponent } from './components/calendar.component';

@NgModule({
  declarations: [CalendarComponent],
  providers: [AgendaService, DayService, WeekService, WorkWeekService, MonthService],
  imports: [CalendarRoutingModule, AntDesignModule, ScheduleModule]
})
export class CalendarModule {}
