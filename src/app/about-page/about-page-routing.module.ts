/*
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../login/guards/auth.guard';
import { AboutPageComponent } from './components/about-page.component';

const routes: Routes = [
  {
    path: '',
    component: AboutPageComponent,
    canActivate: [AuthGuard],
    data: { permission: 0 }
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
export class AboutPageRoutingModule {}