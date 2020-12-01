import { Component, Input, OnChanges } from '@angular/core';

import { History } from '../../shared/history.model';
import { HistoryService } from '../../shared/history.service';

@Component({
  selector: 'app-history-summary',
  templateUrl: './history-summary.component.html',
  styleUrls: ['./history-summary.component.css']
})
export class HistorySummaryComponent implements OnChanges {
  @Input() studentId: number;
  @Input() history: History;
  @Input() isEditable: boolean;

  // Edit final conclusion.
  editing = false;
  loadingAction = false;
  finalConclusion: string;

  constructor(private historyService: HistoryService) {}

  ngOnChanges(): void {
    this.cancelEditignFinalConclusion();
  }

  onInitiEditingFinalConclusion(): void {
    this.editing = true;
    this.finalConclusion = this.history.finalConclusion;
  }

  cancelEditignFinalConclusion(): void {
    this.editing = false;
    this.finalConclusion = '';
  }

  saveHistory(): void {
    this.loadingAction = true;
    this.history.finalConclusion = this.finalConclusion;

    this.historyService.updateHistory(this.studentId, this.history).subscribe(() => {
      this.loadingAction = false;
      this.cancelEditignFinalConclusion();
    });
  }
}
