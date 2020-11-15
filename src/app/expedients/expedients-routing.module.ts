import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { SessionsComponent } from './components/sessions/sessions.component';
import { StudentSessionsComponent } from './components/student-sessions/student-sessions.component';

import { StudentSessionComponent } from './components/student-session/student-session.component';
import { ResponsibleInterviewComponent } from './components/responsible-interview/responsible-interview.component';
import { TeacherInterviewComponent } from './components/teacher-interview/teacher-interview.component';

const routes: Routes = [
  {
    path: '',
    component: SessionsComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  }, 
  {
    path: ':expedient/estudiantes/:student/sesiones',
    component: StudentSessionsComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  }, 
  {
    path: ':expedient/estudiantes/:student/sesiones/sesion-individual',
    component: StudentSessionComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: ':expedient/estudiantes/:student/sesiones/entrevista-docente',
    component: TeacherInterviewComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: ':expedient/estudiantes/:student/sesiones/entrevista-responsable',
    component: ResponsibleInterviewComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedientsRoutingModule { }
