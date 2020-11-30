/*  
  Path: app/app-routing.module.ts
  Objective: Contain major routes
  Author: Esme López
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './login/guards/auth.guard';
import { ConfirmRequestComponent } from './welcome/components/confirm-request/confirm-request.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./welcome/welcome.module').then((m) => m.WelcomeModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'counseling/requests',
    component: ConfirmRequestComponent,
    canActivate: [AuthGuard]
  },
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
  // HACK: Added for testing purposes
  {
    path: 'documents',
    loadChildren: () => import('./document-testing/document-testing.module').then((m) => m.DocumentTestingModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'expedientes',
    loadChildren: () => import('./expedients/expedients.module').then((m) => m.ExpedientsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'reportes',
    loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'pruebas-sociometricas',
    loadChildren: () => import('./sociometric/sociometric.module').then((m) => m.SociometricModule),
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
