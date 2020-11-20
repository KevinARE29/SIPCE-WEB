import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { differenceInCalendarDays } from 'date-fns';

// Models
import { ServiceTypes } from './../../../shared/enums/service-types.enum';
import { Session } from '../../shared/session.model';
import { SessionTypes } from 'src/app/shared/enums/session-types.enum';
import { Responsible } from 'src/app/students/shared/responsible.model';
import { KinshipRelationship } from './../../../shared/kinship-relationship.enum';

import { SessionService } from '../../shared/session.service';
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

  // Form.
  sessionForm: FormGroup;
  actionLoading = false;

  // Responsibles
  responsibleOne: Responsible;
  responsibleTwo: Responsible;
  loadingResponsibles = false;
  kinshipRelationships = Object.keys(KinshipRelationship).filter((k) => isNaN(Number(k)));

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
    private responsibleService: ResponsibleService,
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
      time: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      responsibleOne: [false],
      responsibleTwo: [false],
      otherResponsible: [false],
      otherResponsibleName: this.fb.control({value: '', disabled: true}),
      otherResponsibleRelationship: this.fb.control({value: '', disabled: true}),
      serviceType: [null, [Validators.required]],
      agreements: [null, [Validators.required]],
      treatedTopics: [null, [Validators.required]],
      evaluations: this.fb.array([]),
      comments: [null, [Validators.required]]
    });

    this.getResponsibles();
  }

  // Responsibles
  getResponsibles(): void {
    this.loadingResponsibles = true;
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
    session.sessionType = SessionTypes.ENTREVISTA_PADRES;
    session.startedAt = formValue['date'];
    session.startHour = formValue['time'];
    session.duration = formValue['duration'];
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
      }
    }

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
