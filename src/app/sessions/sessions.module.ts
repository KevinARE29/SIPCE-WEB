import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './components/sessions/sessions.component';
import { StudentSessionsComponent } from './components/student-sessions/student-sessions.component';


@NgModule({
  declarations: [SessionsComponent, StudentSessionsComponent],
  imports: [
    CommonModule,
    AntDesignModule,
    SessionsRoutingModule
  ]
})
export class SessionsModule { }
