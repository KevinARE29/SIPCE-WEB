/*  
  Path: app/reset-password/reset-password-routing.module.ts
  Objetive: Contains reset password routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../login/guards/auth.guard';
import { ResetPasswordComponent } from './components/reset-password.component';

const routes: Routes = [
  { 
    path: '', 
    component: ResetPasswordComponent,
   // canActivate: [AuthGuard]
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
export class ResetPasswordRoutingModule { }
