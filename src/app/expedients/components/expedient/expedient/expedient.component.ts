import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Models and services.
import { Expedient } from 'src/app/expedients/shared/expedient.model';
import { ExpedientService } from 'src/app/expedients/shared/expedient.service';

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

  constructor(private route: ActivatedRoute, private expedientService: ExpedientService) {}

  ngOnInit(): void {
    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    this.loadingExpedients = true;
    this.expedientService.getExpedients(this.studentId).subscribe((r) => {
      this.expedients = r['data'];
      this.setSelectedExpedient(0);
      this.loadingExpedients = false;
    });
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
}
