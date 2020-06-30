import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogsRootComponent } from './components/logs-root.component';
import { AccessLogComponent } from './components/access-log/access-log.component';
import { ActionsLogComponent } from './components/actions-log/actions-log.component';
import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LogsRootComponent,
    canActivate: [AuthGuard],
    data: { permission: 10 }
  },
  {
    path: 'accesos',
    component: AccessLogComponent,
    canActivate: [AuthGuard],
    data: { permission: 10 }
  },
  {
    path: 'acciones',
    component: ActionsLogComponent,
    canActivate: [AuthGuard],
    data: { permission: 10 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogsRoutingModule {}
