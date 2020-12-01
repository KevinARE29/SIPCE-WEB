import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { HistoryListComponent } from './components/history-list/history-list.component';

const routes: Routes = [
  {
    path: '',
    component: HistoryListComponent,
    canActivate: [AuthGuard],
    data: { permission: 32 }
  },
  {
    path: ':studentId',
    component: HistoryDetailComponent,
    canActivate: [AuthGuard],
    data: { permission: 32 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {}