import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesComponent } from './components/roles/roles.component';
import { RoleComponent } from './components/role/role.component';

import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: { permission: 4 }  // TODO: update to the correct permission
  },
  {
    path: ':role',
    component: RoleComponent,
    canActivate: [AuthGuard],
    data: { permission: 4 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
