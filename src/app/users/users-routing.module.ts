import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './components/users/users.component';
import { UploadUsersComponent } from './components/upload-users/upload-users.component';
import { UnauthenticatedUsersComponent } from './components/unauthenticated-users/unauthenticated-users.component';

import { AuthGuard } from './../login/guards/auth.guard';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {
    path: 'consultar',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { permission: 11 }
  },
  {
    path: 'sin-credenciales',
    component: UnauthenticatedUsersComponent,
    canActivate: [AuthGuard],
    data: { permission: 11 }
  },
  {
    path: 'carga-masiva',
    component: UploadUsersComponent,
    canActivate: [AuthGuard],
    data: { permission: 3 }
  },
  {
    path: ':user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { permission: 16 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
