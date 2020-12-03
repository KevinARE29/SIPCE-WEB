import { Component, Input, OnChanges } from '@angular/core';
import { History } from '../../shared/history.model';

@Component({
  selector: 'app-history-comments',
  templateUrl: './history-comments.component.html',
  styleUrls: ['./history-comments.component.css']
})
export class HistoryCommentsComponent implements OnChanges {
  @Input() histories: History[];
  @Input() index: number;

  showHistories: History[];

  ngOnChanges(): void {
    if (this.histories) {
      this.showHistories = this.histories.slice(this.index);
    }
  }
}
