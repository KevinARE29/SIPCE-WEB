import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
// import { ResetPasswordService } from '../shared/reset-password.service';

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  startTime: Date | null = null;
  endTime: Date | null = null;
  daysForm!: FormGroup;
  schedulesForm!: FormGroup;
  show = true;
  message = false;
  btnLoading = false;
  listOfOption: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  constructor(private fb: FormBuilder) {
    this.daysForm = this.fb.group({
      day: ['', [Validators.required, Validators.email]],
      schedules: this.fb.array([])
    });

    this.schedulesForm = this.fb.group({
      startTime: ['', [Validators.required]],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.addSchedule();
  }

  /* Objetivo:
  Manejar el json de horarios
  */
  get scheduleFormsA(): FormArray {
    return this.daysForm.get('schedules') as FormArray;
  }

  addSchedule(): void {
    const schedules = this.fb.group({
      startTime: ['', [Validators.required]],
      endTime: ['', Validators.required]
    });

    this.scheduleFormsA.push(schedules);
  }

  deleteSchedule(i): void {
    this.scheduleFormsA.removeAt(i);
  }
}
