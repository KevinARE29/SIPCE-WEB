import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './components/sessions/sessions.component';
import { StudentSessionsComponent } from './components/student-sessions/student-sessions.component';
import { StudentsDetailsComponent } from './components/students-details/students-details.component';


@NgModule({
  declarations: [
    SessionsComponent,
    StudentSessionsComponent,
    StudentsDetailsComponent
  ],
  imports: [
    CommonModule,
    AntDesignModule,
    SessionsRoutingModule
  ]
})
export class SessionsModule { }
