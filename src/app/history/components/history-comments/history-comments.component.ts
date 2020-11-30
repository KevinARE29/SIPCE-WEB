import { Component, Input } from '@angular/core';
import { History } from '../../shared/history.model';

@Component({
  selector: 'app-history-comments',
  templateUrl: './history-comments.component.html',
  styleUrls: ['./history-comments.component.css']
})
export class HistoryCommentsComponent {
  @Input() histories: History[];
}
