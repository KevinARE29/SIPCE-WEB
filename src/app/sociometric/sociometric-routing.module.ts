import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { CreateQuestionBankComponent } from './components/question-banks/create-question-bank/create-question-bank.component';
import { EditQuestionBankComponent } from './components/question-banks/edit-question-bank/edit-question-bank.component';
import { QuestionBanksComponent } from './components/question-banks/question-banks/question-banks.component';

import { CreateSociometricTestComponent } from './components/sociometric-tests/create-sociometric-test/create-sociometric-test.component';
import { SociometricTestComponent } from './components/sociometric-tests/sociometric-test/sociometric-test.component';
import { SociometricTestsComponent } from './components/sociometric-tests/sociometric-tests/sociometric-tests.component';

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
  },
  {
    path: 'tests',
    children: [
      {
        path: '',
        component: SociometricTestsComponent,
        canActivate: [AuthGuard],
        data: { permission: 30 }
      },
      {
        path: 'nuevo',
        component: CreateSociometricTestComponent,
        canActivate: [AuthGuard],
        data: { permission: 30 }
      },
      {
        path: ':sociometrictest',
        component: SociometricTestComponent,
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
