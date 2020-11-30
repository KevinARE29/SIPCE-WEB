import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HistoryService } from '../../shared/history.service';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})
export class HistoryDetailComponent implements OnInit {
  // Params.
  studentId: number;

  loadingHistory = false;

  constructor(private route: ActivatedRoute, private historyService: HistoryService) {}

  ngOnInit(): void {
    const paramStudent = this.route.snapshot.params['studentId'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    this.loadingHistory = false;
  }
}
