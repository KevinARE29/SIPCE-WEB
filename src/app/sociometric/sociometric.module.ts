import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { SociometricRoutingModule } from './sociometric-routing.module';
import { QuestionBanksComponent } from './components/question-banks/question-banks/question-banks.component';
import { CreateQuestionBankComponent } from './components/question-banks/create-question-bank/create-question-bank.component';
import { EditQuestionBankComponent } from './components/question-banks/edit-question-bank/edit-question-bank.component';
import { SociometricTestsComponent } from './components/sociometric-tests/sociometric-tests/sociometric-tests.component';
import { SociometricTestComponent } from './components/sociometric-tests/sociometric-test/sociometric-test.component';
import { CreateSociometricTestComponent } from './components/sociometric-tests/create-sociometric-test/create-sociometric-test.component';
import { StudentSociometricTestComponent } from './components/sociometric-tests/student-sociometric-test/student-sociometric-test.component';
import { SociometricGroupalResultComponent } from './components/sociometric-result/sociometric-groupal-result/sociometric-groupal-result.component';
import { SociometricIndividualResultComponent } from './components/sociometric-result/sociometric-individual-result/sociometric-individual-result.component';
import { ExportSociometricComponent } from './components/sociometric-result/export-sociometric/export-sociometric.component';

@NgModule({
  declarations: [
    QuestionBanksComponent,
    CreateQuestionBankComponent,
    EditQuestionBankComponent,
    SociometricTestsComponent,
    SociometricTestComponent,
    CreateSociometricTestComponent,
    StudentSociometricTestComponent,
    SociometricGroupalResultComponent,
    SociometricIndividualResultComponent,
    ExportSociometricComponent
  ],
  imports: [AntDesignModule, CommonModule, FormsModule, ReactiveFormsModule, SociometricRoutingModule]
})
export class SociometricModule {}
