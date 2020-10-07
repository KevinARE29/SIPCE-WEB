/*  
  Path: app/app-routing.module.ts
  Objective: Contain major routes
  Author: Esme López
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './login/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/inicio' },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'inicio',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'politicas-seguridad',
    loadChildren: () => import('./security-policies/security-policies.module').then((m) => m.SecurityPoliciesModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'contrasena',
    loadChildren: () => import('./manage-password/reset-password.module').then((m) => m.ResetPasswordModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.module').then((m) => m.RolesModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'bitacora',
    loadChildren: () => import('./logs/logs.module').then((m) => m.LogsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'reset-psw',
    loadChildren: () => import('./manage-password/reset-password.module').then((m) => m.ResetPasswordModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'catalogos',
    loadChildren: () => import('./academic-catalogs/academic-catalogs.module').then((m) => m.AcademicCatalogsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./students/students.module').then((m) => m.StudentsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'asignaciones',
    loadChildren: () => import('./school-year/school-year.module').then((m) => m.SchoolYearModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'calendario',
    loadChildren: () => import('./calendar/calendar.module').then((m) => m.CalendarModule),
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
  exports: [RouterModule]
})
export class AppRoutingModule {}
