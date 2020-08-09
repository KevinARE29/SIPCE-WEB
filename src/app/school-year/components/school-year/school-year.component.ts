import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SchoolYear } from './../../shared/school-year.model';

@Component({
  selector: 'app-school-year',
  templateUrl: './school-year.component.html',
  styleUrls: ['./school-year.component.css']
})
export class SchoolYearComponent implements OnInit {
  schoolYear: SchoolYear;

  // No active or draft school year
  classPeriodForm!: FormGroup;

  // Draf school year
  currentStep = 0;
  tabs = [1, 2, 3, 4, 5]; // TODO: Delete
  // tabs = [1]; // TODO: Delete

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.schoolYear = new SchoolYear();
    this.schoolYear.status = 'En curso'; //TODO: Delete. En curso, En proceso de apertura, Cerrado

    this.initClassPeriod();
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
}
