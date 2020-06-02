import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesComponent } from './components/roles/roles.component';

import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: {permission: 1}  // TODO: update to the correct permission
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
