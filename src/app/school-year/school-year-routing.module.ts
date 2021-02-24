import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchoolYearComponent } from './components/school-year/school-year.component';
import { AuthGuard } from '../login/guards/auth.guard';
import { GradeClosureComponent } from './components/grade-closure/grade-closure.component';

const routes: Routes = [
  {
    path: 'institucion',
    component: SchoolYearComponent,
    canActivate: [AuthGuard],
    data: { permission: 49 }
  },
  {
    path: 'grado',
    component: GradeClosureComponent,
    canActivate: [AuthGuard],
    data: { permission: 48 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolYearRoutingModule {}
