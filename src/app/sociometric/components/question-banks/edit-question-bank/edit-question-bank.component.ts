import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { QuestionBank } from 'src/app/sociometric/shared/question-bank.model';
import { QuestionBankService } from 'src/app/sociometric/shared/question-bank.service';
import { QuestionTypes } from 'src/app/sociometric/shared/question-types.enum';
import { Question } from 'src/app/sociometric/shared/question.model';

@Component({
  selector: 'app-edit-question-bank',
  templateUrl: './edit-question-bank.component.html',
  styleUrls: ['./edit-question-bank.component.css']
})
export class EditQuestionBankComponent implements OnInit {
  loading = false;
  btnLoading = false;
  questionBankForm!: FormGroup;
  questionBank: QuestionBank;
  listOfControl: Array<{ id: number; controlInstance: string; type: string; counter: number }> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private questionBankService: QuestionBankService
  ) {}

  ngOnInit(): void {
    this.questionBank = new QuestionBank();
    this.getQuestionBank();
  }

  getQuestionBank(): void {
    this.route.paramMap.subscribe((params) => {
      const param: string = params.get('questionbank');
      let id: number;

      if (typeof param === 'string' && !Number.isNaN(Number(param))) {
        this.loading = true;
        id = Number(param);

        this.questionBankService.getQuestionBank(id).subscribe(
          (data) => {
            this.loading = false;
            this.questionBank = data['data'];
            this.questionBankForm = this.fb.group({
              name: [this.questionBank.name, [Validators.required, Validators.maxLength(128)]]
            });
            this.initializeForm();
          },
          () => {
            this.loading = false;
            this.router.navigateByUrl('/pruebas-sociometrica/bancos-de-preguntas/' + param, {
              skipLocationChange: true
            });
          }
        );
      } else {
        this.router.navigateByUrl('/pruebas-sociometrica/bancos-de-preguntas/' + param, { skipLocationChange: true });
      }
    });
  }

  initializeForm(): void {
    let id = 0;
    this.questionBank.questions.forEach((question) => {
      let index = 0;
      let control = null;

      switch (question.type) {
        case QuestionTypes['LIDERAZGO']:
          control = {
            id,
            controlInstance: `question${id}`,
            type: 'leadership',
            counter: this.listOfControl.length > 0 ? this.listOfControl[id - 1].counter + 1 : 1
          };

          index = this.listOfControl.push(control);

          this.questionBankForm.addControl(
            this.listOfControl[index - 1].controlInstance,
            new FormControl(question.questionP, [Validators.required, Validators.maxLength(256)])
          );
          break;
        case QuestionTypes['ACEPTACIÓN/RECHAZO']:
          control = {
            id,
            controlInstance: `question${id}`,
            type: 'acceptance',
            counter: this.listOfControl.length > 0 ? this.listOfControl[id - 1].counter + 1 : 1
          };

          index = this.listOfControl.push(control);

          this.questionBankForm.addControl(
            this.listOfControl[index - 1].controlInstance,
            new FormControl(question.questionP, [Validators.required, Validators.maxLength(256)])
          );

          // Rejection
          id++;
          control = {
            id,
            controlInstance: `question${id}`,
            type: 'rejection',
            counter: this.listOfControl[id - 1].counter
          };

          index = this.listOfControl.push(control);

          this.questionBankForm.addControl(
            this.listOfControl[index - 1].controlInstance,
            new FormControl(question.questionN, [Validators.required, Validators.maxLength(256)])
          );
          break;
      }
      id++;
    });
  }

  addField(questionType: string, e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }

    const lastQuestion = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1] : null;
    let id = lastQuestion ? lastQuestion.id + 1 : 0;
    let index = 0;
    let control = null;

    switch (questionType) {
      case 'leadership':
        control = {
          id,
          controlInstance: `question${id}`,
          type: 'leadership',
          counter: lastQuestion ? lastQuestion.counter + 1 : 1
        };
        index = this.listOfControl.push(control);

        this.questionBankForm.addControl(
          this.listOfControl[index - 1].controlInstance,
          new FormControl(null, [Validators.required, Validators.maxLength(256)])
        );
        break;
      case 'acceptance-rejection':
        // Acceptance
        control = {
          id,
          controlInstance: `question${id}`,
          type: 'acceptance',
          counter: lastQuestion ? lastQuestion.counter + 1 : 1
        };

        index = this.listOfControl.push(control);

        this.questionBankForm.addControl(
          this.listOfControl[index - 1].controlInstance,
          new FormControl(null, [Validators.required, Validators.maxLength(256)])
        );

        // Rejection
        id++;
        control = {
          id,
          controlInstance: `question${id}`,
          type: 'rejection',
          counter: lastQuestion ? lastQuestion.counter + 1 : 1
        };

        index = this.listOfControl.push(control);

        this.questionBankForm.addControl(
          this.listOfControl[index - 1].controlInstance,
          new FormControl(null, [Validators.required, Validators.maxLength(256)])
        );

        break;
    }
  }

  removeField(i: { id: number; controlInstance: string; type: string; counter: number }, e: MouseEvent): void {
    e.preventDefault();
    const elementsToRemove = this.listOfControl.filter((item) => item.counter == i.counter);

    elementsToRemove.forEach((element) => {
      const index = this.listOfControl.indexOf(element);
      this.listOfControl.splice(index, 1);
      this.questionBankForm.removeControl(element.controlInstance);
    });

    if (elementsToRemove.length) this.reorderCounters();
  }

  submitForm(): void {
    for (const i in this.questionBankForm.controls) {
      this.questionBankForm.controls[i].markAsDirty();
      this.questionBankForm.controls[i].updateValueAndValidity();
    }

    if (this.questionBankForm.valid) {
      this.transformBody();
    }
  }

  transformBody(): void {
    let i = 0;
    let question: Question;
    this.questionBank.name = this.questionBankForm.value.name;
    this.questionBank.questions = new Array<Question>();

    this.loading = true;

    while (i < this.listOfControl.length) {
      switch (this.listOfControl[i].type) {
        case 'leadership':
          question = new Question();
          question.type = QuestionTypes['LIDERAZGO'];
          question.questionP = this.questionBankForm.controls[this.listOfControl[i].controlInstance].value;
          question.questionN = null;

          this.questionBank.questions.push(question);
          i++;
          break;
        case 'acceptance':
          question = new Question();
          question.type = QuestionTypes['ACEPTACIÓN/RECHAZO'];
          question.questionP = this.questionBankForm.controls[this.listOfControl[i].controlInstance].value;
          question.questionN = this.questionBankForm.controls[this.listOfControl[i + 1].controlInstance].value;

          this.questionBank.questions.push(question);
          i += 2;
          break;
      }
    }

    this.editQuestionBank();
  }

  editQuestionBank(): void {
    this.loading = true;
    this.questionBankService.updateQuestionBank(this.questionBank).subscribe(
      () => {
        this.loading = false;
        this.message.success(`El banco de preguntas '${this.questionBank.name}' se ha actualizado con éxito.`);
      },
      (error) => {
        this.loading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al intentar actualizar el banco de preguntas.',
            error.message,
            {
              nzDuration: 30000
            }
          );
        }
      }
    );
  }

  reorderCounters(): void {
    const total = this.listOfControl.length;

    if (total > 0) {
      if (total == 1) {
        if (this.listOfControl[0]?.counter != 1) this.listOfControl[0].counter = 1;
      } else if (total == 2 && this.listOfControl[0].type == 'acceptance') {
        if (this.listOfControl[0].counter != 1) {
          this.listOfControl[0].counter = 1;
          this.listOfControl[1].counter = 1;
        }
      } else {
        if (this.listOfControl[0].counter != 1) {
          const questions = this.listOfControl.filter((c) => c.counter === this.listOfControl[0].counter);
          this.listOfControl[0].counter = 1;
          if (questions.length > 1) this.listOfControl[1].counter = 1;
        }

        for (let i = 0; i < total; i++) {
          if (this.listOfControl[i + 1]?.counter > this.listOfControl[i].counter + 1) {
            const questions = this.listOfControl.filter((c) => c.counter === this.listOfControl[i + 1].counter);

            this.listOfControl[i + 1].counter = this.listOfControl[i].counter + 1;
            if (questions.length > 1) this.listOfControl[i + 2].counter = this.listOfControl[i].counter + 1;
          }
        }
      }
    }
  }
}
