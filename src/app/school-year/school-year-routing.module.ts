import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchoolYearComponent } from './components/school-year/school-year.component';
import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SchoolYearComponent,
    canActivate: [AuthGuard],
    data: { permission: 19 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolYearRoutingModule {}
