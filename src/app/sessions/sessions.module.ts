import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third-party
import { AntDesignModule } from '../ant-design/ant-design.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './components/sessions/sessions.component';
import { StudentSessionsComponent } from './components/student-sessions/student-sessions.component';
import { StudentsDetailsComponent } from './components/students-details/students-details.component';
import { StudentSessionComponent } from './components/student-session/student-session.component';
import { ResponsibleInterviewComponent } from './components/responsible-interview/responsible-interview.component';
import { TeacherInterviewComponent } from './components/teacher-interview/teacher-interview.component';

@NgModule({
  declarations: [
    SessionsComponent,
    StudentSessionsComponent,
    StudentsDetailsComponent,
    StudentSessionComponent,
    ResponsibleInterviewComponent,
    TeacherInterviewComponent
  ],
  imports: [
    CommonModule,
    AntDesignModule,
    CKEditorModule,
    SessionsRoutingModule
  ]
})
export class SessionsModule { }
