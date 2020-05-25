/*  
  Path: app/app-routing.module.ts
  Objetive: Contain major routes
  Author: Esme López
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './login/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m=> m.WelcomeModule),
    canLoad: [AuthGuard]
  }, 
  {
    path: 'politicas-seguridad',
    loadChildren: () => import('./security-policies/security-policies.module').then( m=> m.SecurityPoliciesModule),
    canLoad: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/error404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
