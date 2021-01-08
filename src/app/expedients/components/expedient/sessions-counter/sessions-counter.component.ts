import { Component, Input } from '@angular/core';
import { SessionsCounter } from 'src/app/expedients/shared/expedient.model';

@Component({
  selector: 'app-sessions-counter',
  templateUrl: './sessions-counter.component.html',
  styleUrls: ['./sessions-counter.component.css']
})
export class SessionsCounterComponent {
  @Input() sessionsCounter: SessionsCounter;
  @Input() isEditable: boolean;
  @Input() studentId: number;
  @Input() expedientId: number;
}
