import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { History } from '../../shared/history.model';
import { HistoryService } from '../../shared/history.service';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})
export class HistoryDetailComponent implements OnInit {
  // Params.
  studentId: number;

  // History
  loadingHistory = false;
  histories: History[];
  selectedHistory: History;
  selectedHistoryIndex: number;
  selectedHistoryIsFirst: boolean;
  selectedHistoryIsLast: boolean;
  selectedHistoryIsActive: boolean;

  constructor(private route: ActivatedRoute, private historyService: HistoryService) {}

  ngOnInit(): void {
    const paramStudent = this.route.snapshot.params['studentId'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    this.getHistories();
  }

  getHistories(): void {
    this.loadingHistory = true;
    this.historyService.getStudentHistory(this.studentId).subscribe((r) => {
      this.histories = r;
      this.setHistory(0);
      this.loadingHistory = false;
    });
  }

  setHistory(index: number): void {
    if (index >= 0 && index < this.histories.length) {
      this.selectedHistory = this.histories[index];
      this.selectedHistoryIndex = index;
      this.selectedHistoryIsActive = index === 0;
      this.selectedHistoryIsFirst = index === 0;
      this.selectedHistoryIsLast = index === this.histories.length - 1;
    }
  }
}
