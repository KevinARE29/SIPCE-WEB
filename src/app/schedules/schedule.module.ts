import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ScheduleRoutingModule } from './schedule-routing.module';

import { ScheduleComponent } from './components/schedule/schedule.component';

import { AntDesignModule } from '../ant-design/ant-design.module';
import { CreateScheduleComponent } from './components/create-schedule/create-schedule.component';

// import { AuthService } from './shared/auth.service';

@NgModule({
  declarations: [ScheduleComponent, CreateScheduleComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ScheduleRoutingModule, HttpClientModule, AntDesignModule],
  providers: []
})
export class ScheduleModule {}
