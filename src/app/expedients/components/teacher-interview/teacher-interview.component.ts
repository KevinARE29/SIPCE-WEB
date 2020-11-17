import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { differenceInCalendarDays } from 'date-fns';

import { ServiceTypes } from './../../../shared/enums/service-types.enum';

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

  // Duration input.
  durationFormatter = (value: number) => value ? `${value} min` : '';
  durationParser = (value: string) => value.replace(' min', '');

  // Service types
  serviceTypes = Object.keys(ServiceTypes).filter((k) => isNaN(Number(k)));

  // Editor
  editor = ClassicEditor;
  editorConfig = {
    language: 'es',
    toolbar: [ 'heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|' ,'undo', 'redo' ]
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder
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
      comments: [null, [Validators.required]]
    });
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

}
