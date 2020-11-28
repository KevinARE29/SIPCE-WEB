import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';
import { CreateQuestionsBanksComponent } from './components/question-banks/create-questions-banks/create-questions-banks.component';

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
        component: CreateQuestionsBanksComponent,
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
