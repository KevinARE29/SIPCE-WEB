/*  
  Path: app/security-policies/security-policies-routing.module.ts
  Objetive: Contains security policies routes
  Author: Esme López
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityPoliciesComponent } from './components/security-policies.component';

import { AuthGuard } from './../login/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: SecurityPoliciesComponent,
    canActivate: [AuthGuard],
    data: {permission: 2}  
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
export class SecurityPoliciesRoutingModule { }
