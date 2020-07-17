/*
  Path: app/reset-password/password-routing.module.ts
  Objetive: Contain reset password routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowSectionsComponent } from './components/show-sections/show-sections.component';
import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  {
    path: 'secciones',
    component: ShowSectionsComponent,
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
