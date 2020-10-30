import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './components/sessions/sessions.component';
import { StudentSessionsComponent } from './components/student-sessions/student-sessions.component';


@NgModule({
  declarations: [SessionsComponent, StudentSessionsComponent],
  imports: [
    CommonModule,
    SessionsRoutingModule
  ]
})
export class SessionsModule { }
