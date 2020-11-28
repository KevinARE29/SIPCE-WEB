import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { HistoryRoutingModule } from './history-routing.module';

import { HistoryListComponent } from './components/history-list/history-list.component';
import { HistoryDetailComponent } from './components/history-detail/history-detail.component';
import { StudentDetailsComponent } from './components/student-details/student-details.component';
import { HistorySummaryComponent } from './components/history-summary/history-summary.component';
import { HistoryAnnotationsComponent } from './components/history-annotations/history-annotations.component';
import { HistoryFoulsSanctionsComponent } from './components/history-fouls-sanctions/history-fouls-sanctions.component';
import { HistoryCommentsComponent } from './components/history-comments/history-comments.component';

@NgModule({
  declarations: [
    HistoryListComponent,
    HistoryDetailComponent,
    StudentDetailsComponent,
    HistorySummaryComponent,
    HistoryAnnotationsComponent,
    HistoryFoulsSanctionsComponent,
    HistoryCommentsComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, AntDesignModule, HistoryRoutingModule]
})
export class HistoryModule {}
