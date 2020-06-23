/*
  Path: app/reset-password/password-routing.module.ts
  Objetive: Contain reset password routes
  Author: Veronica Reyes
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordComponent } from './components/reset-password.component';
import { UpgradePasswordComponent } from './components/upgrade-password/upgrade-password.component';
import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
    {
        path: 'recuperar',
        component: ResetPasswordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'cambiar',
        component: UpgradePasswordComponent,
       canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/error404',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PasswordRoutingModule { }
