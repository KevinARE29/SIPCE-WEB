import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SociometricRoutingModule } from './sociometric-routing.module';
import { QuestionsBanksComponent } from './components/question-banks/questions-banks/questions-banks.component';
import { CreateQuestionsBanksComponent } from './components/question-banks/create-questions-banks/create-questions-banks.component';
import { EditQuestionsBanksComponent } from './components/question-banks/edit-questions-banks/edit-questions-banks.component';


@NgModule({
  declarations: [QuestionsBanksComponent, CreateQuestionsBanksComponent, EditQuestionsBanksComponent],
  imports: [
    CommonModule,
    SociometricRoutingModule
  ]
})
export class SociometricModule { }
