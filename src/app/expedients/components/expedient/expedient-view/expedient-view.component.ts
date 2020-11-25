import { Component, Input, Output, EventEmitter } from '@angular/core';

// Models and services.
import { Expedient } from 'src/app/expedients/shared/expedient.model';
import { ExpedientService } from 'src/app/expedients/shared/expedient.service';

@Component({
  selector: 'app-expedient-view',
  templateUrl: './expedient-view.component.html',
  styleUrls: ['./expedient-view.component.css']
})
export class ExpedientViewComponent {
  @Input() expedient: Expedient;
  @Input() isEditable: boolean;
  @Output() initEditing = new EventEmitter<void>();

  constructor(private expedientService: ExpedientService) {}

  onInitEditing(): void {
    this.initEditing.emit();
  }
}
