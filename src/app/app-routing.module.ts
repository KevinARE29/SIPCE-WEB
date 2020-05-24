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
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m=> m.WelcomeModule),
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
