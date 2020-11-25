import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Models and services.
import { Expedient } from 'src/app/expedients/shared/expedient.model';
import { ExpedientService } from 'src/app/expedients/shared/expedient.service';
import { DiagnosticImpressionCategories } from 'src/app/shared/enums/diagnostic-impression-categories.enum';
import { PsychologicalTreatmentTypes } from 'src/app/shared/enums/psychological-treatment-types.enum';

// NG Zorro
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-expedient-form',
  templateUrl: './expedient-form.component.html',
  styleUrls: ['./expedient-form.component.css']
})
export class ExpedientFormComponent implements OnInit {
  @Input() expedient: Expedient;
  @Input() studentId: number;
  @Output() cancelEditing = new EventEmitter<void>();
  @Output() expedientSaved = new EventEmitter<Expedient>();

  // Form.
  expedientForm: FormGroup;
  actionLoading = false;

  // Selects.
  diagnosticImpressionCategories = Object.values(DiagnosticImpressionCategories).filter((k) => isNaN(Number(k)));
  psychologicalTreatmentTypes = Object.values(PsychologicalTreatmentTypes).filter((k) => isNaN(Number(k)));
  showOtherExternalPsychologicalTreatment = false;
  showOtherDiagnosticImpressionCategory = false;

  constructor(
    private expedientService: ExpedientService,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.expedientForm = this.fb.group({
      referrerName: [this.expedient ? this.expedient.referrerName : null, [Validators.required]],
      reason: [this.expedient ? this.expedient.reason : null, [Validators.required]],
      problemDescription: [this.expedient ? this.expedient.problemDescription : null, [Validators.required]],
      diagnosticImpressionCategories: [this.expedient ? this.expedient.diagnosticImpressionCategories : null],
      otherDiagnosticImpressionCategory: [this.expedient ? this.expedient.otherDiagnosticImpressionCategory : null],
      diagnosticImpression: [this.expedient ? this.expedient.diagnosticImpression : null],
      externalPsychologicalTreatments: [this.expedient ? this.expedient.externalPsychologicalTreatments : null],
      otherExternalPsychologicalTreatment: [this.expedient ? this.expedient.otherExternalPsychologicalTreatment : null],
      actionPlan: [this.expedient ? this.expedient.actionPlan : null]
    });

    if (this.expedient && this.expedient.otherDiagnosticImpressionCategory) {
      this.showOtherDiagnosticImpressionCategory = true;
      this.otherDiagnosticImpressionCategoryControl.setValidators([Validators.required]);
      this.otherDiagnosticImpressionCategoryControl.updateValueAndValidity();
    }

    if (this.expedient && this.expedient.otherExternalPsychologicalTreatment) {
      this.showOtherExternalPsychologicalTreatment = true;
      this.otherExternalPsychologicalTreatmentControl.setValidators([Validators.required]);
      this.otherExternalPsychologicalTreatmentControl.updateValueAndValidity();
    }
  }

  // otherDiagnosticImpressionCategory
  get otherDiagnosticImpressionCategoryControl(): AbstractControl {
    return this.expedientForm.get('otherDiagnosticImpressionCategory');
  }

  onDiagnosticImpressionCategoryChange(categories: string[]): void {
    if (categories.includes(DiagnosticImpressionCategories.OTRO)) {
      this.showOtherDiagnosticImpressionCategory = true;
      this.otherDiagnosticImpressionCategoryControl.setValidators([Validators.required]);
      this.otherDiagnosticImpressionCategoryControl.updateValueAndValidity();
    } else {
      this.showOtherDiagnosticImpressionCategory = false;
      this.otherDiagnosticImpressionCategoryControl.setValidators(null);
      this.otherDiagnosticImpressionCategoryControl.updateValueAndValidity();
    }
  }

  // otherExternalPsychologicalTreatment
  get otherExternalPsychologicalTreatmentControl(): AbstractControl {
    return this.expedientForm.get('otherExternalPsychologicalTreatment');
  }

  onExternalPsychologicalTreatmentChange(treatments: string[]): void {
    if (treatments.includes(PsychologicalTreatmentTypes.OTRO)) {
      this.showOtherExternalPsychologicalTreatment = true;
      this.otherExternalPsychologicalTreatmentControl.setValidators([Validators.required]);
      this.otherExternalPsychologicalTreatmentControl.updateValueAndValidity();
    } else {
      this.showOtherExternalPsychologicalTreatment = false;
      this.otherExternalPsychologicalTreatmentControl.setValidators(null);
      this.otherExternalPsychologicalTreatmentControl.updateValueAndValidity();
    }
  }

  submitForm(): void {
    for (const i in this.expedientForm.controls) {
      this.expedientForm.controls[i].markAsDirty();
      this.expedientForm.controls[i].updateValueAndValidity();
    }

    if (this.expedientForm.valid) {
      this.saveExpedient();
    }
  }

  saveExpedient(): void {
    this.actionLoading = true;

    const formValue = this.expedientForm.value;

    const expedient = new Expedient();
    expedient.referrerName = formValue['referrerName'];
    expedient.reason = formValue['reason'];
    expedient.problemDescription = formValue['problemDescription'];
    expedient.diagnosticImpressionCategories = formValue['diagnosticImpressionCategories'];
    expedient.otherDiagnosticImpressionCategory = formValue['otherDiagnosticImpressionCategory'];
    expedient.diagnosticImpression = formValue['diagnosticImpression'];
    expedient.externalPsychologicalTreatments = formValue['externalPsychologicalTreatments'];
    expedient.otherExternalPsychologicalTreatment = formValue['otherExternalPsychologicalTreatment'];
    expedient.actionPlan = formValue['actionPlan'];

    if (this.expedient) {
      expedient.id = this.expedient.id;
      expedient.finalConclusion = this.expedient.finalConclusion;
    }

    this.expedientService.saveExpedient(this.studentId, expedient).subscribe(
      (r) => {
        const message = this.expedient ? 'Expediente actualizado correctamente' : 'Expediente abierto correctamente';
        this.message.success(message);

        this.expedientSaved.emit(r);

        // this.router.navigate(['expedientes', 'estudiantes', this.expedientId, this.studentId, 'sesiones']);
      },
      (error) => {
        this.actionLoading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar registrar el expediente.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  onCancel(): void {
    this.cancelEditing.emit();
  }
}
