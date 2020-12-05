import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { ExpedientService } from 'src/app/expedients/shared/expedient.service';
import { StudentWithExpedient } from 'src/app/expedients/shared/student-with-expedient.model';

@Component({
  selector: 'app-export-expedient',
  templateUrl: './export-expedient.component.html',
  styleUrls: ['./export-expedient.component.css']
})
export class ExportExpedientComponent implements OnInit {
  // Param.
  studentId: number;
  expedientId: number;

  // Data.
  loadingData: boolean;
  data: StudentWithExpedient;
  date: string;

  // List of filters.
  availableFilters = [
    'references',
    'externalPsychologicalTreatments',
    'diagnosticImpression',
    'actionPlan',
    'evaluations'
  ];

  filters: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private expedientService: ExpedientService) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.router.navigate(['/login/error403']);
    }

    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    const paramExpedient = this.route.snapshot.params['expedient'];
    if (typeof paramExpedient === 'string' && !Number.isNaN(Number(paramExpedient))) {
      this.expedientId = Number(paramExpedient);
    }

    const paramFilters: string = this.route.snapshot.queryParams['filter'];
    if (paramFilters) {
      const requestFilters = paramFilters.split(',');
      this.filters = requestFilters.filter((f) => this.availableFilters.includes(f));
    }

    this.loadingData = true;
    this.expedientService.exportExpedient(this.studentId, this.expedientId, token, this.filters).subscribe((data) => {
      this.data = data;

      console.log(data);

      this.date = format(new Date(), 'd/MMMM/yyyy', { locale: es });

      this.loadingData = false;
    });
  }
}
