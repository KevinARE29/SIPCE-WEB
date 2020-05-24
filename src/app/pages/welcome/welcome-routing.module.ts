import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

import { AuthGuard } from './../../login/guards/auth.guard';

const routes: Routes = [
  { 
    path: 'welcome', 
    component: WelcomeComponent,
    canActivate: [AuthGuard],
    data: {permission: 3} 
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule { }
