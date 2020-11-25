import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Third-party
import { AntDesignModule } from '../ant-design/ant-design.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { ExpedientsRoutingModule } from './expedients-routing.module';

// Sessions
import { SessionsComponent } from './components/sessions/sessions-list/sessions.component';
import { StudentSessionsComponent } from './components/sessions/student-sessions/student-sessions.component';
import { StudentsDetailsComponent } from './components/sessions/students-details/students-details.component';
import { StudentSessionComponent } from './components/sessions/student-session/student-session.component';
import { ResponsibleInterviewComponent } from './components/sessions/responsible-interview/responsible-interview.component';
import { TeacherInterviewComponent } from './components/sessions/teacher-interview/teacher-interview.component';

// Intervention programs.
import { InterventionProgramsListComponent } from './components/intervention-programs/intervention-programs-list/intervention-programs-list.component';
import { InterventionProgramsFormComponent } from './components/intervention-programs/intervention-programs-form/intervention-programs-form.component';

// Expedient
import { ExpedientComponent } from './components/expedient/expedient/expedient.component';
import { StudentsDetailsComponent as StudentsDetailsExpedientComponent } from './components/expedient/students-details/students-details.component';
import { SessionsCounterComponent } from './components/expedient/sessions-counter/sessions-counter.component';

@NgModule({
  declarations: [
    SessionsComponent,
    StudentSessionsComponent,
    StudentsDetailsComponent,
    StudentSessionComponent,
    ResponsibleInterviewComponent,
    TeacherInterviewComponent,
    InterventionProgramsListComponent,
    InterventionProgramsFormComponent,
    ExpedientComponent,
    StudentsDetailsExpedientComponent,
    SessionsCounterComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, AntDesignModule, CKEditorModule, ExpedientsRoutingModule]
})
export class ExpedientsModule {}
