import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { SessionsComponent } from './components/sessions/sessions-list/sessions.component';
import { StudentSessionsComponent } from './components/sessions/student-sessions/student-sessions.component';

import { StudentSessionComponent } from './components/sessions/student-session/student-session.component';
import { ResponsibleInterviewComponent } from './components/sessions/responsible-interview/responsible-interview.component';
import { TeacherInterviewComponent } from './components/sessions/teacher-interview/teacher-interview.component';

// Intervention programs.
import { InterventionProgramsListComponent } from './components/intervention-programs/intervention-programs-list/intervention-programs-list.component';

// Expedient
import { ExpedientComponent } from './components/expedient/expedient/expedient.component';

const routes: Routes = [
  {
    path: 'estudiantes',
    component: SessionsComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'estudiantes/:student',
    component: ExpedientComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'estudiantes/:expedient/:student/sesiones',
    component: StudentSessionsComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'estudiantes/:expedient/:student/sesiones/sesion-individual',
    component: StudentSessionComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'estudiantes/:expedient/:student/sesiones/sesion-individual/:session',
    component: StudentSessionComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'estudiantes/:expedient/:student/sesiones/entrevista-docente',
    component: TeacherInterviewComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'estudiantes/:expedient/:student/sesiones/entrevista-docente/:session',
    component: TeacherInterviewComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'estudiantes/:expedient/:student/sesiones/entrevista-responsable',
    component: ResponsibleInterviewComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'estudiantes/:expedient/:student/sesiones/entrevista-responsable/:session',
    component: ResponsibleInterviewComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  },
  {
    path: 'programas',
    component: InterventionProgramsListComponent,
    canActivate: [AuthGuard],
    data: { permission: 33 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedientsRoutingModule {}
