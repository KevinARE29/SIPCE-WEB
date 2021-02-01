import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Models and services.
import { Expedient } from 'src/app/expedients/shared/expedient.model';
import { ExpedientService } from 'src/app/expedients/shared/expedient.service';

import { ReportService } from 'src/app/shared/report.service';
import { ReportTypes } from 'src/app/shared/enums/report-types.enum';

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.css']
})
export class ExpedientComponent implements OnInit {
  studentId: number;

  loadingExpedients = false;
  expedients: Expedient[];

  selectedExpedient: Expedient;
  selectedExpedientIndex: number;
  selectedExpedientExists: boolean;
  selectedExpedientIsFirst: boolean;
  selectedExpedientIsLast: boolean;
  selectedExpedientIsEditable: boolean;
  editing = false;

  // Report
  showReportModal = false;
  filterReferences = true;
  filterTreatments = true;
  filterEvaluations = true;
  filterDiagnosticImpression = true;
  filterActionPlan = true;
  loadingReport: boolean;

  // Current year, to add it to labels.
  currentYear = new Date().getFullYear();

  // Error message
  errorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private expedientService: ExpedientService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    this.loadingExpedients = true;
    this.expedientService.getExpedients(this.studentId).subscribe(
      (r) => {
        this.expedients = r;
        this.setSelectedExpedient(0);
        this.loadingExpedients = false;
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }

  setSelectedExpedient(index: number): void {
    if (index >= 0 && index < this.expedients.length) {
      this.selectedExpedient = this.expedients[index];
      this.selectedExpedientIndex = index;
      this.selectedExpedientExists = !!this.selectedExpedient.id;
      this.selectedExpedientIsFirst = index === 0;
      this.selectedExpedientIsLast = index === this.expedients.length - 1;
      this.selectedExpedientIsEditable = index === 0;
      this.editing = false;
    }
  }

  setEditing(editing: boolean): void {
    this.editing = editing;
  }

  onExpedientSaved(expedient: Expedient): void {
    this.expedients[this.selectedExpedientIndex] = expedient;
    this.setSelectedExpedient(this.selectedExpedientIndex);
  }

  setShowReportModal(show: boolean): void {
    this.showReportModal = show;
  }

  exportExpedient(): void {
    this.loadingReport = true;
    this.setShowReportModal(false);

    const filters = [];
    if (this.filterReferences) filters.push('references');
    if (this.filterTreatments) filters.push('externalPsychologicalTreatments');
    if (this.filterEvaluations) filters.push('evaluations');
    if (this.filterDiagnosticImpression) filters.push('diagnosticImpression');
    if (this.filterActionPlan) filters.push('actionPlan');

    const path = '/expedientes/estudiantes/' + this.selectedExpedient.id + '/' + this.studentId + '/exportar';

    this.reportService.createReport(ReportTypes.EXPEDIENTE_PSICOLÓGICO, path, filters).subscribe((r) => {
      const downloadURL = window.URL.createObjectURL(r);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = ReportTypes.EXPEDIENTE_PSICOLÓGICO + '.pdf';
      link.click();

      this.loadingReport = false;
    });
  }
}
