import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { differenceInCalendarDays } from 'date-fns';

// Models
import { ServiceTypes } from './../../../../shared/enums/service-types.enum';
import { Session } from '../../../shared/session.model';
import { SessionTypes } from 'src/app/shared/enums/session-types.enum';
import { Responsible } from 'src/app/students/shared/responsible.model';
import { KinshipRelationship } from './../../../../shared/kinship-relationship.enum';

import { SessionService } from '../../../shared/session.service';
import { ResponsibleService } from 'src/app/students/shared/responsible.service';

// Editor.
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// NG Zorro
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-responsible-interview',
  templateUrl: './responsible-interview.component.html',
  styleUrls: ['./responsible-interview.component.css']
})
export class ResponsibleInterviewComponent implements OnInit {
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

  // Responsibles
  responsibleOne: Responsible;
  responsibleTwo: Responsible;
  loadingResponsibles = false;
  kinshipRelationships = Object.keys(KinshipRelationship).filter((k) => isNaN(Number(k)));

  // Duration input.
  durationFormatter = (value: number): string => (value ? `${value} min` : '');
  durationParser = (value: string): string => value.replace(' min', '');

  // Service types
  serviceTypes = Object.keys(ServiceTypes).filter((k) => isNaN(Number(k)));

  // Editor.
  editor = ClassicEditor;
  editorConfig = {
    language: 'es',
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
  };
  model = {
    editorData: '<p>Hello, world!</p>'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private responsibleService: ResponsibleService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) {}

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
      time: [this.session ? this.session.startHour : null, [Validators.required]],
      duration: [this.session ? this.session.duration : null, [Validators.required]],
      responsibleOne: [false],
      responsibleTwo: [false],
      otherResponsible: [false],
      otherResponsibleName: this.fb.control({ value: '', disabled: true }),
      otherResponsibleRelationship: this.fb.control({ value: '', disabled: true }),
      serviceType: [this.session ? this.session.serviceType : null, [Validators.required]],
      agreements: [this.session ? this.session.agreements : null, [Validators.required]],
      treatedTopics: [this.session ? this.session.treatedTopics : null, [Validators.required]],
      evaluations: this.fb.array([]),
      comments: [this.session ? this.session.comments : null, [Validators.required]]
    });

    if (this.session && this.session.evaluations) {
      this.session.evaluations.forEach((evaluation) => {
        this.addEvaluation(evaluation.id, evaluation.description);
      });
    }

    this.getResponsibles();
  }

  // Responsibles
  getResponsibles(): void {
    this.loadingResponsibles = true;

    if (this.session) {
      this.responsibleOne = this.session.sessionResponsibleAssistence.responsible1;
      this.responsibleTwo = this.session.sessionResponsibleAssistence.responsible2;

      this.sessionForm.get('responsibleOne').setValue(this.session.sessionResponsibleAssistence.responsible1Assistence);
      this.sessionForm.get('responsibleTwo').setValue(this.session.sessionResponsibleAssistence.responsible2Assistence);

      const otherResponsible =
        !!this.session.sessionResponsibleAssistence.otherResponsibleName &&
        !!this.session.sessionResponsibleAssistence.otherResponsibleRelationship;
      this.sessionForm.get('otherResponsible').setValue(otherResponsible);

      if (otherResponsible) {
        this.otherResponsibleRelationshipControl.setValue(
          this.session.sessionResponsibleAssistence.otherResponsibleRelationship
        );
        this.otherResponsibleNameControl.setValue(this.session.sessionResponsibleAssistence.otherResponsibleName);

        this.onChangeOtherResponsible(otherResponsible);
      }

      this.loadingResponsibles = false;
    } else {
      this.responsibleService.getResponsibles(this.studentId).subscribe((r) => {
        const responsibles = r['data'];

        if (responsibles[0]) {
          this.responsibleOne = responsibles[0];
        }

        if (responsibles[1]) {
          this.responsibleOne = responsibles[1];
        }

        this.loadingResponsibles = false;
      });
    }
  }

  get otherResponsibleRelationshipControl(): AbstractControl {
    return this.sessionForm.get('otherResponsibleRelationship');
  }

  get otherResponsibleNameControl(): AbstractControl {
    return this.sessionForm.get('otherResponsibleName');
  }

  onChangeOtherResponsible(checked: boolean): void {
    if (checked) {
      this.otherResponsibleRelationshipControl.setValidators([Validators.required]);
      this.otherResponsibleRelationshipControl.updateValueAndValidity();
      this.otherResponsibleRelationshipControl.enable();

      this.otherResponsibleNameControl.setValidators([Validators.required]);
      this.otherResponsibleNameControl.updateValueAndValidity();
      this.otherResponsibleNameControl.enable();
    } else {
      this.otherResponsibleRelationshipControl.setValidators(null);
      this.otherResponsibleRelationshipControl.updateValueAndValidity();
      this.otherResponsibleRelationshipControl.disable();

      this.otherResponsibleNameControl.setValidators(null);
      this.otherResponsibleNameControl.updateValueAndValidity();
      this.otherResponsibleNameControl.disable();
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

  submitForm(submitter: string): void {
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

    const isDraft = submitter === 'draft';

    if (this.sessionForm.valid) {
      if (isDraft) {
        this.saveSession(true);
      } else {
        this.modal.confirm({
          nzTitle: '¿Desea registrar la sesión?',
          nzContent: 'La sesión ya no se podrá editar luego de realizar esta acción. ¿Desea continuar?',
          nzOnOk: () => {
            this.saveSession(false);
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
    session.sessionType = SessionTypes.ENTREVISTA_PADRES;
    session.startedAt = formValue['date'];
    session.startHour = formValue['time'];
    session.duration = Number.parseInt(formValue['duration']);
    session.serviceType = formValue['serviceType'];
    session.agreements = formValue['agreements'];
    session.treatedTopics = formValue['treatedTopics'];
    session.comments = formValue['comments'];
    session.evaluations = formValue['evaluations'];

    // Responsibles.
    session.responsibles = [];

    if (this.responsibleOne) {
      session.responsibles.push({
        id: this.responsibleOne.id,
        attended: formValue['responsibleOne']
      });
    }

    if (this.responsibleTwo) {
      session.responsibles.push({
        id: this.responsibleTwo.id,
        attended: formValue['responsibleTwo']
      });
    }

    if (formValue['otherResponsible']) {
      session.otherResponsible = {
        otherResponsibleName: formValue['otherResponsibleName'],
        otherResponsibleRelationship: formValue['otherResponsibleRelationship']
      };
    } else {
      session.otherResponsible = null;
    }

    if (this.session) {
      session.id = this.session.id;
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
