import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HistoryService } from 'src/app/history/shared/history.service';
import { StudentWithHistory } from 'src/app/history/shared/student-with-history.model';

@Component({
  selector: 'app-export-history',
  templateUrl: './export-history.component.html',
  styleUrls: ['./export-history.component.css']
})
export class ExportHistoryComponent implements OnInit {
  // Param.
  studentId: number;
  historyId: number;

  // Data.
  loadingData: boolean;
  data: StudentWithHistory;

  // List of filters.
  availableFilters = ['finalConclusion', 'expedients', 'annotations', 'p1', 'p2', 'p3', 'p4'];

  filters: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private historyService: HistoryService) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    const userId = this.route.snapshot.queryParams['userId'];

    if (!token || !userId) {
      this.router.navigate(['/login/error403']);
    }

    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    const paramHistory = this.route.snapshot.params['history'];
    if (typeof paramHistory === 'string' && !Number.isNaN(Number(paramHistory))) {
      this.historyId = Number(paramHistory);
    }

    const paramFilters: string = this.route.snapshot.queryParams['filter'];
    if (paramFilters) {
      const requestFilters = paramFilters.split(',');
      this.filters = requestFilters.filter((f) => this.availableFilters.includes(f));
    }

    this.loadingData = true;
    this.historyService.exportHistory(this.studentId, this.historyId, token, this.filters, userId).subscribe((data) => {
      this.data = data;

      this.loadingData = false;
    });
  }
}
