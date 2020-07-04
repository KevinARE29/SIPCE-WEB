import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadUsersComponent } from './components/upload-users/upload-users.component';

import { AuthGuard } from './../login/guards/auth.guard';

const routes: Routes = [
  {
    path: 'carga-masiva',
    component: UploadUsersComponent,
    canActivate: [AuthGuard],
    data: { permission: 2 }
  },
  {
    path: '**',
    redirectTo: '/error404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
