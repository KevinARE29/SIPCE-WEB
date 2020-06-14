/*
  Path: app/logIn/app-routing.module.ts
  Objective: Contain Login routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'error401',
    component: UnauthorizedComponent
  }, {
    path: 'error403',
    component: ForbiddenComponent
  }, {
    path: 'error404',
    component: NotFoundComponent
  }, {
    path: 'error500',
    component: ServerErrorComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
