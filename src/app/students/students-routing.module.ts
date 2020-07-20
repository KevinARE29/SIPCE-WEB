import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadStudentsComponent } from './components/upload-students/upload-students.component';
import { AuthGuard } from '../login/guards/auth.guard';

const routes: Routes = [
  {
    path: 'carga-masiva',
    component: UploadStudentsComponent,
    canActivate: [AuthGuard],
    data: { permission: 11 }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
