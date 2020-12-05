import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { HistoryListComponent } from './components/history-list/history-list.component';
import { ExportHistoryComponent } from './components/export-history/export-history.component';

const routes: Routes = [
  {
    path: '',
    component: HistoryListComponent,
    canActivate: [AuthGuard],
    data: { permission: 47 }
  },
  {
    path: ':studentId',
    component: HistoryDetailComponent,
    canActivate: [AuthGuard],
    data: { permission: 47 }
  },
  {
    path: ':student/:history/exportar',
    component: ExportHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {}
