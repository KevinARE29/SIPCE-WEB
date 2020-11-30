import { Component, Input } from '@angular/core';

import { History } from '../../shared/history.model';
import { HistoryService } from '../../shared/history.service';

@Component({
  selector: 'app-history-summary',
  templateUrl: './history-summary.component.html',
  styleUrls: ['./history-summary.component.css']
})
export class HistorySummaryComponent {
  @Input() history: History;

  constructor(private historyService: HistoryService) {}
}
