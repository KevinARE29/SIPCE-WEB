import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { differenceInCalendarDays } from 'date-fns';

// Models
import { ServiceTypes } from './../../../shared/enums/service-types.enum';
import { Session } from '../../shared/session.model';
import { SessionTypes } from 'src/app/shared/enums/session-types.enum';

import { SessionService } from '../../shared/session.service';

// Editor.
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// NG Zorro
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-student-session',
  templateUrl: './student-session.component.html',
  styleUrls: ['./student-session.component.css']
})
export class StudentSessionComponent implements OnInit {
  // Param.
  studentId: number;
  expedientId: number;

  // Form.
  sessionForm: FormGroup;
  actionLoading = false;

  // Duration input.
  durationFormatter = (value: number) => value ? `${value} min` : '';
  durationParser = (value: string) => value.replace(' min', '');

  // Service types
  serviceTypes = Object.keys(ServiceTypes).filter((k) => isNaN(Number(k)));

  // Editor.
  editor = ClassicEditor;
  editorConfig = {
    language: 'es',
    toolbar: [ 'heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|' ,'undo', 'redo' ]
  };
  model = {
    editorData: '<p>Hello, world!</p>'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    const paramExpedient = this.route.snapshot.params['expedient'];
    if (typeof paramExpedient === 'string' && !Number.isNaN(Number(paramExpedient))) {
      this.expedientId = Number(paramExpedient);
    }

    this.sessionForm = this.fb.group({
      date: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      serviceType: [null, [Validators.required]],
      evaluations: this.fb.array([], [Validators.required]),
      comments: [null, [Validators.required]]
    });
  }

  // Evaluations
  get evaluationsControl(): FormArray {
    return this.sessionForm.get('evaluations') as FormArray;
  }

  addEvaluation(): void {
    const evaluationForm = this.fb.group({
      description: [null, [Validators.required]]
    });

    this.evaluationsControl.push(evaluationForm);
  }

  removeEvaluation(index: number): void {
    this.evaluationsControl.removeAt(index);
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

    // To control the evaluation FormGroups
    this.evaluationsControl.controls.forEach((evaluationForm: FormGroup) => {
      for (const i in evaluationForm.controls) {
        evaluationForm.controls[i].markAsDirty();
        evaluationForm.controls[i].updateValueAndValidity();
      }
    });

    const isDraft = event.submitter.id === 'draft';

    if (this.sessionForm.valid) {
      if (isDraft) {
        this.createSession(true);
      } else {
        this.modal.confirm({
          nzTitle: '¿Desea registrar la sesión?',
          nzContent: 'La sesión ya no se podrá editar luego de realizar esta acción. ¿Desea continuar?',
          nzOnOk: () => {
            this.createSession(false)
          }
        });
      }
    }
  }

  createSession(isDraft: boolean): void {
    this.actionLoading = true;

    const formValue = this.sessionForm.value;

    const session = new Session();
    session.draft = isDraft;
    session.sessionType = SessionTypes.SESION;
    session.startedAt = formValue['date'];
    session.duration = formValue['duration'];
    session.serviceType = formValue['serviceType'];
    session.comments = formValue['comments'];
    session.participants = formValue['participants'];
    session.evaluations = formValue['evaluations'];

    this.sessionService.createSession(this.expedientId, this.studentId, session).subscribe(
      () => {
        const message = isDraft ? 'La sesión se ha guardado como borrador.' : 'La sesión ha sido registrada';
        this.message.success(message);
        this.router.navigate(['..'], {relativeTo: this.route});
      },
      (error) => {
        this.actionLoading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar registrar la sesión.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

}
