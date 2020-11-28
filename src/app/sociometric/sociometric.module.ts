import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { SociometricRoutingModule } from './sociometric-routing.module';
import { QuestionBanksComponent } from './components/question-banks/question-banks/question-banks.component';
import { CreateQuestionsBanksComponent } from './components/question-banks/create-questions-banks/create-questions-banks.component';
import { EditQuestionsBanksComponent } from './components/question-banks/edit-questions-banks/edit-questions-banks.component';

@NgModule({
  declarations: [QuestionBanksComponent, CreateQuestionsBanksComponent, EditQuestionsBanksComponent],
  imports: [AntDesignModule, CommonModule, FormsModule, ReactiveFormsModule, SociometricRoutingModule]
})
export class SociometricModule {}
