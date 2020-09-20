/*
  Path: app/academic-catalogs/sections-routing.module.ts
  Objetive: Contain the manage academics catalogs routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectionsComponent } from './components/sections/sections.component';
import { GradesComponent } from './components/grades/grades.component';
import { ShowShiftComponent } from './components/show-shift/show-shift.component';
import { PeriodsComponent } from './components/periods/periods.component';
import { CyclesComponent } from './components/cycles/cycles.component';
import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  {
    path: 'secciones',
    component: SectionsComponent,
    canActivate: [AuthGuard],
    data: { permission: 13 }
  },
  {
    path: 'grados',
    component: GradesComponent,
    canActivate: [AuthGuard],
    data: { permission: 13 }
  },
  {
    path: 'turnos',
    component: ShowShiftComponent,
    canActivate: [AuthGuard],
    data: { permission: 13 }
  },
  {
    path: 'periodos',
    component: PeriodsComponent,
    canActivate: [AuthGuard],
    data: { permission: 13 }
  },
  {
    path: 'ciclos',
    component: CyclesComponent,
    canActivate: [AuthGuard],
    data: { permission: 13 }
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
export class AcademicCatalogsRoutingModule {}
