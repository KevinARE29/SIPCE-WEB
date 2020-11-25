import { Component, Input, Output, EventEmitter } from '@angular/core';

// Models and services.
import { Expedient } from 'src/app/expedients/shared/expedient.model';
import { ExpedientService } from 'src/app/expedients/shared/expedient.service';

@Component({
  selector: 'app-expedient-form',
  templateUrl: './expedient-form.component.html',
  styleUrls: ['./expedient-form.component.css']
})
export class ExpedientFormComponent {
  @Input() expedient: Expedient;
  @Output() cancelEditing = new EventEmitter<void>();

  actionLoading = false;

  constructor(private expedientService: ExpedientService) {}

  onCancel(): void {
    this.cancelEditing.emit();
  }
}
