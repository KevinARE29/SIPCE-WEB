/*  
  Path: app/app-routing.module.ts
  Objetive: Contain major routes
  Author: Esme López
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
