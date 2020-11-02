/*
  Path: app/reset-password/password-routing.module.ts
  Objetive: Contain reset password routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';

import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  {
    path: 'eventos',
    component: CalendarComponent
  },
  {
    path: 'proximos',
    component: UpcomingEventsComponent
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
