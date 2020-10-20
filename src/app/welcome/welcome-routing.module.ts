import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { WelcomeComponent } from './components/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [AuthGuard],
    data: { permission: 0 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule {}