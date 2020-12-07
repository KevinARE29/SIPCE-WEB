import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { SociometricTestComponent } from './components/sociometric-test/sociometric-test.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [AuthGuard],
    data: { permission: 0 }
  },
  {
    path: 'prueba-sociometrica',
    component: SociometricTestComponent
    // Avoid access 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule {}
