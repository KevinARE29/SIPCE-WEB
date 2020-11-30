import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';
import { CreateQuestionBankComponent } from './components/question-banks/create-question-bank/create-question-bank.component';
import { EditQuestionBankComponent } from './components/question-banks/edit-question-bank/edit-question-bank.component';

import { QuestionBanksComponent } from './components/question-banks/question-banks/question-banks.component';

const routes: Routes = [
  {
    path: 'bancos-de-preguntas',
    children: [
      {
        path: '',
        component: QuestionBanksComponent,
        canActivate: [AuthGuard],
        data: { permission: 30 }
      },
      {
        path: 'nuevo',
        component: CreateQuestionBankComponent,
        canActivate: [AuthGuard],
        data: { permission: 30 }
      },
      {
        path: ':questionbank',
        component: EditQuestionBankComponent,
        canActivate: [AuthGuard],
        data: { permission: 30 }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SociometricRoutingModule {}
