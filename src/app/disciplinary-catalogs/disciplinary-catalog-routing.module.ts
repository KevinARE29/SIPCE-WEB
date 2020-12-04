import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../login/guards/auth.guard';
import { SanctionComponent } from './components/sanction/sanction.component';
import { FaultComponent } from './components/fault/fault.component';

const routes: Routes = [
  {
    path: 'sanciones',
    component: SanctionComponent,
    canActivate: [AuthGuard],
    data: { permission: 29 }
  },
  {
    path: 'faltas',
    component: FaultComponent,
    canActivate: [AuthGuard],
    data: { permission: 27 }
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
export class DisciplinaryCatalogRoutingModule {}
