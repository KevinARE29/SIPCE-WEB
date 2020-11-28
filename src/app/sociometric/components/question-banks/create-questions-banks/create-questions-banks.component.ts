import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Question } from 'src/app/sociometric/shared/question.model';
import { QuestionsBank } from 'src/app/sociometric/shared/questions-bank.model';

@Component({
  selector: 'app-create-questions-banks',
  templateUrl: './create-questions-banks.component.html',
  styleUrls: ['./create-questions-banks.component.css']
})
export class CreateQuestionsBanksComponent implements OnInit {
  questionBankForm!: FormGroup;
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.questionBankForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `question${id}`
    };
    const index = this.listOfControl.push(control);
    // console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.questionBankForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      new FormControl(null, Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      // console.log(this.listOfControl);
      this.questionBankForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    for (const i in this.questionBankForm.controls) {
      this.questionBankForm.controls[i].markAsDirty();
      this.questionBankForm.controls[i].updateValueAndValidity();
    }
    console.log(this.questionBankForm.value);
  }
}
