/*  
  Path: app/security-policies/security-policies-routing.module.ts
  Objetive: Contains security policies routes
  Author: Esme López
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityPoliciesComponent } from './components/security-policies.component';

const routes: Routes = [{ 
    path: 'politicas-seguridad', 
    component: SecurityPoliciesComponent 
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class SecurityPoliciesRoutingModule { }
