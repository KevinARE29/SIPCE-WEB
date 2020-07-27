/*
  Path: app/schedules/schedule-routing.module.ts
  Objetive: Contain the schedule routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { CreateScheduleComponent } from './components/create-schedule/create-schedule.component';
// import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  {
    path: 'horarios',
    component: ScheduleComponent
    //  canActivate: [AuthGuard],
    //  data: { permission: 13 }
  },
  {
    path: 'horarios/crear',
    component: CreateScheduleComponent
    //  canActivate: [AuthGuard],
    //  data: { permission: 13 }
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
export class ScheduleRoutingModule {}
