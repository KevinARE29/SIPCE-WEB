import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';

import { Question } from 'src/app/sociometric/shared/question.model';
import { QuestionsBank } from 'src/app/sociometric/shared/questions-bank.model';

@Component({
  selector: 'app-create-questions-banks',
  templateUrl: './create-questions-banks.component.html',
  styleUrls: ['./create-questions-banks.component.css']
})
export class CreateQuestionsBanksComponent implements OnInit {
  questionsBankForm!: FormGroup;
  questionsBank: QuestionsBank;
  listOfControl: Array<{ id: number; controlInstance: string; type: string; counter: number }> = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.questionsBank = new QuestionsBank();
    this.questionsBankForm = this.fb.group({
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

        this.questionsBankForm.addControl(
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

        this.questionsBankForm.addControl(
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

        this.questionsBankForm.addControl(
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
      this.questionsBankForm.removeControl(element.controlInstance);
    });

    if (elementsToRemove.length) this.reorderCounters();
  }

  submitForm(): void {
    for (const i in this.questionsBankForm.controls) {
      this.questionsBankForm.controls[i].markAsDirty();
      this.questionsBankForm.controls[i].updateValueAndValidity();
    }

    this.transformBody();
    if (this.questionsBankForm.valid) {
      this.transformBody();
      console.log(this.questionsBankForm, this.listOfControl);
    }
  }

  transformBody(): void {
    let i = 0;
    const question = new Question();
    this.questionsBank.name = this.questionsBankForm.value.name;
    this.questionsBank.questions = new Array<Question>();

    while (i < this.listOfControl.length) {
      console.log(this.listOfControl[i].type, i);
      switch (this.listOfControl[i].type) {
        case 'leadership':
          question.type = '';
          question.questionP = this.questionsBankForm.controls[this.listOfControl[i].controlInstance].value;
          question.questionN = null;
          console.log(question, 'L');
          this.questionsBank.questions.push(question);
          i++;
          break;
        case 'acceptance':
          question.type = '';
          console.log(i, (i += 1));
          question.questionP = this.questionsBankForm.controls[this.listOfControl[i].controlInstance].value;
          question.questionN = this.questionsBankForm.controls[this.listOfControl[(i += 1)].controlInstance].value;

          this.questionsBank.questions.push(question);
          console.log(question, 'AR');
          i += 2;
          break;
      }
    }

    console.log(this.questionsBank);
  }

  reorderCounters(): void {
    console.log();
  }
}
