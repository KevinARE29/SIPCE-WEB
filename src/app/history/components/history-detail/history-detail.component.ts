import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Permission } from 'src/app/shared/permission.model';
import { History } from '../../shared/history.model';
import { HistoryService } from '../../shared/history.service';
import { AuthService } from 'src/app/login/shared/auth.service';

import { ReportService } from 'src/app/shared/report.service';
import { ReportTypes } from 'src/app/shared/enums/report-types.enum';

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

  // History permissions.
  permissions: Permission[] = [];
  userId: number;

  // Report
  showReportModal = false;
  filterFinalConclusion = true;
  filterExpedients = true;
  filterAnnotations = true;
  filterPeriods = true;
  filterPeriodsIndeterminate = false;
  filterPeriod1 = true;
  filterPeriod2 = true;
  filterPeriod3 = true;
  filterPeriod4 = true;
  loadingReport: boolean;

  constructor(
    private route: ActivatedRoute,
    private historyService: HistoryService,
    private authService: AuthService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    const paramStudent = this.route.snapshot.params['studentId'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    this.setPermissions();
    this.getHistories();
  }

  /* ------      Control page permissions      ------ */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    // To check if current user is the author of a history.
    this.userId = content.id;

    this.permissions.push(new Permission(31, ''));

    // Annotation permissions
    this.permissions.push(new Permission(44, ''));
    this.permissions.push(new Permission(36, ''));
    this.permissions.push(new Permission(37, ''));
    this.permissions.push(new Permission(38, ''));

    // Assignation permissions.
    this.permissions.push(new Permission(46, ''));
    this.permissions.push(new Permission(41, ''));
    this.permissions.push(new Permission(42, ''));
    this.permissions.push(new Permission(43, ''));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);
      p.allow = index == -1 ? false : true;
    });
  }

  checkPermission(id: number): boolean {
    if (this.permissions) {
      const index = this.permissions.find((p) => p.id === id);
      return index.allow;
    }

    return false;
  }

  getHistories(): void {
    this.loadingHistory = true;
    this.historyService.getStudentHistory(this.studentId).subscribe((r) => {
      this.histories = r.sort((a, b) => b.behavioralHistoryYear - a.behavioralHistoryYear);
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

  setShowReportModal(show: boolean): void {
    this.showReportModal = show;
  }

  updateAllPeriods(): void {
    this.filterPeriodsIndeterminate = false;

    this.filterPeriod1 = this.filterPeriods;
    this.filterPeriod2 = this.filterPeriods;
    this.filterPeriod3 = this.filterPeriods;
    this.filterPeriod4 = this.filterPeriods;
  }

  updateSinglePeriod(): void {
    if (this.filterPeriod1 && this.filterPeriod2 && this.filterPeriod3 && this.filterPeriod4) {
      this.filterPeriodsIndeterminate = false;
      this.filterPeriods = true;
    } else if (!this.filterPeriod1 && !this.filterPeriod2 && !this.filterPeriod3 && !this.filterPeriod4) {
      this.filterPeriodsIndeterminate = false;
      this.filterPeriods = false;
    } else {
      this.filterPeriodsIndeterminate = true;
    }
  }

  exportHistory(): void {
    this.loadingReport = true;
    this.setShowReportModal(false);

    const filters = [];
    if (this.filterFinalConclusion) filters.push('finalConclusion');
    if (this.filterExpedients) filters.push('expedients');
    if (this.filterAnnotations) filters.push('annotations');
    if (this.filterPeriod1) filters.push('p1');
    if (this.filterPeriod2) filters.push('p2');
    if (this.filterPeriod3) filters.push('p3');
    if (this.filterPeriod4) filters.push('p4');

    const path = '/historial/' + this.studentId + '/' + this.selectedHistory.id + '/exportar';

    this.reportService
      .createReport(ReportTypes.HISTORIAL_ACADÉMICO_CONDUCTUAL, path, filters, this.userId)
      .subscribe((r) => {
        const downloadURL = window.URL.createObjectURL(r);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = ReportTypes.HISTORIAL_ACADÉMICO_CONDUCTUAL;
        link.click();

        this.loadingReport = false;
      });
  }
}
