import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { differenceInCalendarDays } from 'date-fns';

// Models
import { ServiceTypes } from './../../../../shared/enums/service-types.enum';
import { User } from '../../../../users/shared/user.model';
import { Session } from '../../../shared/session.model';
import { SessionTypes } from 'src/app/shared/enums/session-types.enum';

import { UserService } from '../../../../users/shared/user.service';
import { SessionService } from '../../../shared/session.service';

// Editor.
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// NG Zorro
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-teacher-interview',
  templateUrl: './teacher-interview.component.html',
  styleUrls: ['./teacher-interview.component.css']
})
export class TeacherInterviewComponent implements OnInit {
  // Param.
  studentId: number;
  expedientId: number;
  sessionId: number;

  // Edit object
  loadingSession = false;
  session: Session;

  // Form.
  sessionForm: FormGroup;
  actionLoading = false;

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
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
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

    const paramSession = this.route.snapshot.params['session'];
    if (typeof paramSession === 'string' && !Number.isNaN(Number(paramSession))) {
      this.sessionId = Number(paramSession);
    }

    // Get session.
    if (this.sessionId) {
      this.loadingSession = true;

      // To avoid errors
      this.sessionForm = this.fb.group({});

      this.sessionService.getSession(this.expedientId, this.studentId, this.sessionId).subscribe((r) => {
        this.session = r['data'];
        this.buildForm();
        this.loadingSession = false;
      });
    } else {
      this.buildForm();
    }
  }

  buildForm(): void {
    this.sessionForm = this.fb.group({
      date: [this.session ? this.session.startedAt : null, [Validators.required]],
      duration: [this.session ? this.session.duration : null, [Validators.required]],
      participants: [[], [Validators.required]],
      serviceType: [this.session ? this.session.serviceType : null, [Validators.required]],
      evaluations: this.fb.array([]),
      comments: [this.session ? this.session.comments : null, [Validators.required]]
    });

    if (this.session && this.session.evaluations) {
      this.session.evaluations.forEach((evaluation) => {
        this.addEvaluation(evaluation.id, evaluation.description);
      });
    }

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

    if (this.session) {
      this.participantsControl.setValue(this.session.counselor.map((participant) => participant.id));
    }
  }

  // Evaluations
  get evaluationsControl(): FormArray {
    return this.sessionForm.get('evaluations') as FormArray;
  }

  addEvaluation(id: number = null, description: string = null): void {
    const evaluationForm = this.fb.group({
      description: [description, [Validators.required]]
    });

    if (id) {
      evaluationForm.addControl('id', this.fb.control(id));
    }

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
        this.saveSession(true);
      } else {
        this.modal.confirm({
          nzTitle: '¿Desea registrar la sesión?',
          nzContent: 'La sesión ya no se podrá editar luego de realizar esta acción. ¿Desea continuar?',
          nzOnOk: () => {
            this.saveSession(false)
          }
        });
      }
    }
  }

  saveSession(isDraft: boolean): void {
    this.actionLoading = true;

    const formValue = this.sessionForm.value;

    const session = new Session();
    session.draft = isDraft;
    session.sessionType = SessionTypes.ENTREVISTA_DOCENTE;
    session.startedAt = formValue['date'];
    session.duration = Number.parseInt(formValue['duration']);
    session.serviceType = formValue['serviceType'];
    session.comments = formValue['comments'];
    session.participants = formValue['participants'];
    session.evaluations = formValue['evaluations'];

    if (this.session) {
      session.id = this.session.id
    }

    this.sessionService.saveSession(this.expedientId, this.studentId, session).subscribe(
      () => {
        const message = isDraft ? 'La sesión se ha guardado como borrador.' : 'La sesión ha sido registrada';
        this.message.success(message);
        this.router.navigate(['expedientes', this.expedientId, 'estudiantes', this.studentId, 'sesiones']);
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
