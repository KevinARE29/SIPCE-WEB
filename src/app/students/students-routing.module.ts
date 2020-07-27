import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { UploadStudentsComponent } from './components/upload-students/upload-students.component';
import { StudentsComponent } from './components/students/students.component';
import { NewStudentComponent } from './components/new-student/new-student.component';
import { StudentComponent } from './components/student/student.component';

const routes: Routes = [
  {
    path: 'carga-masiva',
    component: UploadStudentsComponent,
    canActivate: [AuthGuard],
    data: { permission: 11 } // TODO: Change permission
  },
  {
    path: 'consultar',
    component: StudentsComponent,
    canActivate: [AuthGuard],
    data: { permission: 11 } // TODO: Change permission
  },
  {
    path: 'nuevo',
    component: NewStudentComponent,
    canActivate: [AuthGuard],
    data: { permission: 11 } // TODO: Change permission
  },
  {
    path: ':student',
    children: [
      {
        path: 'detalle',
        component: StudentComponent,
        canActivate: [AuthGuard],
        data: { permission: 11 } // TODO: Change permission
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {}
