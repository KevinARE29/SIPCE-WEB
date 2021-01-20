import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { SociometricResultService } from 'src/app/sociometric/shared/sociometric-result/sociometric-result.service';
import { SociometricResult } from 'src/app/sociometric/shared/sociometric-result/sociometric-result.model';

@Component({
  selector: 'app-export-sociometric',
  templateUrl: './export-sociometric.component.html',
  styleUrls: ['./export-sociometric.component.css']
})
export class ExportSociometricComponent implements OnInit {
  MAX_STUDENTS = 25;

  logo: string;
  name: string;

  // Param.
  testId: number;

  // Data.
  loadingData: boolean;
  data: SociometricResult;

  // List of filters.
  availableFilters = [
    'participants',
    'questionBank',
    'groupalIndexes',
    'sociomatrix',
    'individualIndexes',
    'sociometricValues'
  ];

  filters: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sociometricService: SociometricResultService
  ) {
    this.logo = environment.logo;
    this.name = environment.name;
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.router.navigate(['/login/error403']);
    }

    const paramTest = this.route.snapshot.params['sociometrictest'];
    if (typeof paramTest === 'string' && !Number.isNaN(Number(paramTest))) {
      this.testId = Number(paramTest);
    }

    const paramFilters: string = this.route.snapshot.queryParams['filter'];
    if (paramFilters) {
      const requestFilters = paramFilters.split(',');
      this.filters = requestFilters.filter((f) => this.availableFilters.includes(f));
    }

    this.loadingData = true;
    this.sociometricService.exportSociometricTest(this.testId, token, this.filters).subscribe((data) => {
      this.data = data;

      this.loadingData = false;
    });
  }
}
