import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { differenceInCalendarDays } from 'date-fns';

import { ServiceTypes } from './../../../shared/enums/service-types.enum';
import { User } from '../../../users/shared/user.model';

import { UserService } from '../../../users/shared/user.service';

// Editor.
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-teacher-interview',
  templateUrl: './teacher-interview.component.html',
  styleUrls: ['./teacher-interview.component.css']
})
export class TeacherInterviewComponent implements OnInit {
  // Param.
  studentId: number;

  // Form.
  sessionForm: FormGroup;
  actionLoading = false;
  submitAsDraft = false;

  // Duration input.
  durationFormatter = (value: number) => value ? `${value} min` : '';
  durationParser = (value: string) => value.replace(' min', '');

  // Service types
  serviceTypes = Object.keys(ServiceTypes).filter((k) => isNaN(Number(k)));

  // Participants
  userResults: User[] = [];
  loadingUsers = false;


  // Editor
  editor = ClassicEditor;
  editorConfig = {
    language: 'es',
    toolbar: [ 'heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|' ,'undo', 'redo' ]
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const param = this.route.snapshot.params['student'];

    if (typeof param === 'string' && !Number.isNaN(Number(param))) {
      this.studentId = Number(param);
    } 

    this.sessionForm = this.fb.group({
      date: [null, [Validators.required]],
      duration: ['', [Validators.required]],
      serviceType: [null, [Validators.required]],
      comments: [null, [Validators.required]],
      participants: [[], [Validators.required]],
      evaluations: [[]]
    });

    this.getUsers();
  }

  // Participants
  get participantsControl(): AbstractControl {
    return this.sessionForm.get('participants');
  }

  getUsers(): void {
    this.loadingUsers = true;
    this.userService.getUserByUsername('').subscribe((r) => {
      this.userResults = r['data'];
      this.loadingUsers = false;
    });
  }

  // Date.
  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  submitForm(event: any): void {
    for (const i in this.sessionForm.controls) {
      this.sessionForm.controls[i].markAsDirty();
      this.sessionForm.controls[i].updateValueAndValidity();
    }

    console.log(this.sessionForm.value);
  }

}
