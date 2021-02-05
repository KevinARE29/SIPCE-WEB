import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { QuestionTypes } from '../../../shared/question-types.enum';
import { Question } from 'src/app/sociometric/shared/question.model';
import { QuestionBank } from 'src/app/sociometric/shared/question-bank.model';
import { QuestionBankService } from 'src/app/sociometric/shared/question-bank.service';

@Component({
  selector: 'app-create-questions-banks',
  templateUrl: './create-question-bank.component.html',
  styleUrls: ['./create-question-bank.component.css']
})
export class CreateQuestionBankComponent implements OnInit {
  loading = false;
  questionBankForm!: FormGroup;
  questionBank: QuestionBank;
  listOfControl: Array<{ id: number; controlInstance: string; type: string; counter: number }> = [];
  minQuestionsError = false;

  constructor(
    private fb: FormBuilder,
    private questionBankService: QuestionBankService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.questionBank = new QuestionBank();
    this.questionBankForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(128)]]
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

    this.minQuestionsError = false;
  }

  removeField(i: { id: number; controlInstance: string; type: string; counter: number }, e: MouseEvent): void {
    if (e) e.preventDefault();
    const elementsToRemove = this.listOfControl.filter((item) => item.counter == i.counter);

    elementsToRemove.forEach((element) => {
      const index = this.listOfControl.indexOf(element);
      this.listOfControl.splice(index, 1);
      this.questionBankForm.removeControl(element.controlInstance);
    });

    if (elementsToRemove.length) this.reorderCounters();

    if (!this.listOfControl.length) this.minQuestionsError = true;
  }

  submitForm(): void {
    for (const i in this.questionBankForm.controls) {
      this.questionBankForm.controls[i].markAsDirty();
      this.questionBankForm.controls[i].updateValueAndValidity();
    }

    if (this.questionBankForm.valid) {
      this.transformBody();
    } else {
      if (!this.listOfControl.length) this.minQuestionsError = true;
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

    this.createQuestionBank();
  }

  createQuestionBank(): void {
    if (this.questionBank.questions.length) {
      this.questionBankService.createQuestionsBank(this.questionBank).subscribe(
        () => {
          this.loading = false;
          this.message.success(`El banco de preguntas '${this.questionBank.name}' ha sido creado`);
          this.questionBankForm.reset();
          this.listOfControl.forEach((question) => {
            this.removeField(question, null);
          });
        },
        (error) => {
          this.loading = false;
          const statusCode = error.statusCode;
          const notIn = [401, 403];

          if (!notIn.includes(statusCode) && statusCode < 500) {
            this.notification.create(
              'error',
              'Ocurrió un error al intentar crear el banco de preguntas.',
              error.message,
              {
                nzDuration: 30000
              }
            );
          }
        }
      );
    } else {
      this.minQuestionsError = true;
      this.loading = false;
    }
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
