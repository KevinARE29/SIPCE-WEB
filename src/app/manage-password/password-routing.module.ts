/*
  Path: app/reset-password/password-routing.module.ts
  Objetive: Contain reset password in routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//components
import { ResetPasswordComponent } from './components/reset-password.component';
//guards


const routes: Routes = [
    {
        path: '',
        component: ResetPasswordComponent,
        //    canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/error404',
        pathMatch: 'full'
    }
    // {
    //   path: 'error401',
    //   component: UnauthorizedComponent
    // }, {
    //   path: 'error403',
    //   component: ForbiddenComponent
    // }, {
    //   path: 'error404',
    //   component: NotFoundComponent
    // }, {
    //   path: 'error500',
    //   component: ServerErrorComponent
    // }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PasswordRoutingModule { }
