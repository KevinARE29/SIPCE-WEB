/*
  Path: app/manage-academic-catalogs/sections-routing.module.ts
  Objetive: Contain the manage academics catalogs routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowSectionsComponent } from './components/show-sections/show-sections.component';
import { ShowCyclesComponent } from './components/show-cycles/show-cycles.component';
import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  {
    path: 'secciones',
    component: ShowSectionsComponent,
    canActivate: [AuthGuard],
    data: { permission: 13 }
  },
  {
    path: 'ciclos',
    component: ShowCyclesComponent,
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
export class SectionsRoutingModule {}
