import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SchoolYear } from './../../shared/school-year.model';
import { SchoolYearService } from '../../shared/school-year.service';
import { Catalogs } from '../../shared/catalogs.model';

@Component({
  selector: 'app-school-year',
  templateUrl: './school-year.component.html',
  styleUrls: ['./school-year.component.css']
})
export class SchoolYearComponent implements OnInit {
  loading = false;
  schoolYear: SchoolYear;
  catalogs: Catalogs;

  // No active or draft school year
  classPeriodForm!: FormGroup;

  // Draf school year
  currentStep = 0;
  tabs = [1, 2, 3, 4, 5]; // TODO: Delete
  // tabs = [1]; // TODO: Delete

  constructor(private fb: FormBuilder, private schoolYearService: SchoolYearService) {}

  ngOnInit(): void {
    this.schoolYear = new SchoolYear();
    this.catalogs = new Catalogs();
    this.initClassPeriod();
    this.getSchoolYear();
  }

  getSchoolYear(): void {
    this.loading = true;
    this.schoolYearService.mergeSchoolYearAndCatalogs().subscribe((data) => {
      // School Year
      this.schoolYear = data['schoolYear'];
      this.schoolYear.status = 'En proceso de apertura'; //TODO: Delete. En curso, En proceso de apertura, Cerrado

      // Catalogs
      this.catalogs.shifts = data['shifts']['data'].filter((x) => x.active === true).sort((a, b) => a.id - b.id);
      this.catalogs.cycles = data['cycles']['data'].sort((a, b) => a.id - b.id);
      this.catalogs.grades = data['grades']['data'].filter((x) => x.active === true);
      this.catalogs.sections = data['sections']['data']
        .filter((x) => x.name.length === 1)
        .concat(data['sections']['data'].filter((x) => x.name.length > 1));

      this.loading = false;
    });
  }

  //#region New school year
  initClassPeriod(): void {
    this.classPeriodForm = this.fb.group({
      classPeriod: ['', [Validators.required]]
    });
  }

  submitClassPeriod(): void {
    for (const i in this.classPeriodForm.controls) {
      this.classPeriodForm.controls[i].markAsDirty();
      this.classPeriodForm.controls[i].updateValueAndValidity();
    }

    if (this.classPeriodForm.valid) {
      // this.classPeriodForm.controls['classPeriod'].value;
      // initializeSteps
    }
  }
  //#endregion

  //#region Draf school year
  pre(): void {
    this.currentStep -= 1;
  }

  next(): void {
    this.currentStep += 1;
  }

  done(): void {
    console.log('done');
  }
  //#endregion

  updateItem(cycle: string): void {
    console.log('Parent ', cycle);
  }
}
