import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { SessionTypeComponent } from './components/session-type/session-type.component';

const routes: Routes = [
  {
    path: 'tipos-de-sesion',
    component: SessionTypeComponent,
    canActivate: [AuthGuard],
    data: { permission: 7 } // TODO: Update
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
