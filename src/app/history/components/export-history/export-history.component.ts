import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
  date: string;

  constructor(private route: ActivatedRoute, private router: Router, private historyService: HistoryService) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
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

    this.loadingData = true;
    this.historyService.exportHistory(this.studentId, this.historyId, token, []).subscribe((data) => {
      this.data = data;
      console.log(data);

      this.date = format(new Date(), 'd/MMMM/yyyy', { locale: es });

      this.loadingData = false;
    });
  }
}
