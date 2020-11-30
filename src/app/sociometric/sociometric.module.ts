import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { SociometricRoutingModule } from './sociometric-routing.module';
import { QuestionBanksComponent } from './components/question-banks/question-banks/question-banks.component';
import { CreateQuestionBankComponent } from './components/question-banks/create-question-bank/create-question-bank.component';
import { EditQuestionBankComponent } from './components/question-banks/edit-question-bank/edit-question-bank.component';

@NgModule({
  declarations: [QuestionBanksComponent, CreateQuestionBankComponent, EditQuestionBankComponent],
  imports: [AntDesignModule, CommonModule, FormsModule, ReactiveFormsModule, SociometricRoutingModule]
})
export class SociometricModule {}
