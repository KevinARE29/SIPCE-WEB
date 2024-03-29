/*
  Path: app/reset-password/password-routing.module.ts
  Objetive: Contain reset password routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../login/guards/auth.guard';

import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CounselingRequestsComponent } from './components/counseling-requests/counseling-requests.component';

const routes: Routes = [
  {
    path: 'eventos',
    component: CalendarComponent,
    canActivate: [AuthGuard],
    data: { permission: 19 }
  },
  {
    path: 'proximos',
    component: UpcomingEventsComponent,
    canActivate: [AuthGuard],
    data: { permission: 19 }
  },
  {
    path: 'solicitudes',
    component: CounselingRequestsComponent,
    canActivate: [AuthGuard],
    data: { permission: 22 }
  },
  {
    path: '**',
    redirectTo: '/error404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule {}
