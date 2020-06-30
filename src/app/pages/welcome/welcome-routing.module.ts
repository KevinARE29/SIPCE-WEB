import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

import { AuthGuard } from './../../login/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
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
  exports: [RouterModule]
})
export class WelcomeRoutingModule {}
