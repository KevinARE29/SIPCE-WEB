import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';

import { HistoryRoutingModule } from './history-routing.module';

import { HistoryListComponent } from './components/history-list/history-list.component';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { StudentDetailsComponent } from './components/student-details/student-details.component';
import { HistorySummaryComponent } from './components/history-summary/history-summary.component';
import { HistoryAnnotationsComponent } from './components/history-annotations/history-annotations.component';
import { HistoryFoulsSanctionsComponent } from './components/history-fouls-sanctions/history-fouls-sanctions.component';
import { HistoryCommentsComponent } from './components/history-comments/history-comments.component';
import { ExportHistoryComponent } from './components/export-history/export-history.component';

@NgModule({
  declarations: [
    HistoryListComponent,
    HistoryDetailComponent,
    StudentDetailsComponent,
    HistorySummaryComponent,
    HistoryAnnotationsComponent,
    HistoryFoulsSanctionsComponent,
    HistoryCommentsComponent,
    ExportHistoryComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, AntDesignModule, NzTimelineModule, HistoryRoutingModule]
})
export class HistoryModule {}
