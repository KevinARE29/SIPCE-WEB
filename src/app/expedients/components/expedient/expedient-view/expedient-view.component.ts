import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// Models and services.
import { Expedient } from 'src/app/expedients/shared/expedient.model';
import { ExpedientService } from 'src/app/expedients/shared/expedient.service';

@Component({
  selector: 'app-expedient-view',
  templateUrl: './expedient-view.component.html',
  styleUrls: ['./expedient-view.component.css']
})
export class ExpedientViewComponent implements OnChanges {
  @Input() expedient: Expedient;
  @Input() isEditable: boolean;
  @Input() studentId: number;
  @Output() initEditing = new EventEmitter<void>();

  // Edit final comment.
  editing = false;
  loadingAction = false;
  finalConclusion: string;

  constructor(private expedientService: ExpedientService) {}

  ngOnChanges(): void {
    this.cancelEditignFinalConclusion();
  }

  onInitEditing(): void {
    this.initEditing.emit();
  }

  onInitiEditingFinalConclusion(): void {
    this.editing = true;
    this.finalConclusion = this.expedient.finalConclusion;
  }

  cancelEditignFinalConclusion(): void {
    this.editing = false;
    this.finalConclusion = '';
  }

  saveExpedient(): void {
    this.loadingAction = true;
    this.expedient.finalConclusion = this.finalConclusion;

    this.expedientService.saveExpedient(this.studentId, this.expedient).subscribe(() => {
      this.loadingAction = false;
      this.cancelEditignFinalConclusion();
    });
  }
}
