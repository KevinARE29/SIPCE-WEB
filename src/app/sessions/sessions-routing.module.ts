import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { SessionsComponent } from './components/sessions/sessions.component';
import { StudentSessionsComponent } from './components/student-sessions/student-sessions.component';

const routes: Routes = [
  {
    path: '',
    component: SessionsComponent,
    canActivate: [AuthGuard],
    data: { permission: 22 } // TODO: Update permission id
  }, 
  {
    path: ':student',
    component: StudentSessionsComponent,
    canActivate: [AuthGuard],
    data: { permission: 22 } // TODO: Update permission id
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SessionsRoutingModule { }
