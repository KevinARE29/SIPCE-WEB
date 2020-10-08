import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../login/guards/auth.guard';

import { UploadStudentsComponent } from './components/upload-students/upload-students.component';
import { StudentsComponent } from './components/students/students.component';
import { NewStudentComponent } from './components/new-student/new-student.component';
import { StudentComponent } from './components/student/student.component';
import { UpdateStudentComponent } from './components/update-student/update-student.component';
import { StudentsAssignmentComponent } from './components/students-assignment/students-assignment.component';

const routes: Routes = [
  {
    path: 'carga-masiva',
    component: UploadStudentsComponent,
    canActivate: [AuthGuard],
    data: { permission: 17 }
  },
  {
    path: 'consultar',
    component: StudentsComponent,
    canActivate: [AuthGuard],
    data: { permission: 18 }
  },
  {
    path: 'nuevo',
    component: NewStudentComponent,
    canActivate: [AuthGuard],
    data: { permission: 17 }
  },
  {
    path: 'asignar',
    component: StudentsAssignmentComponent,
    canActivate: [AuthGuard],
    data: { permission: 23 }
  },
  {
    path: ':student',
    children: [
      {
        path: 'detalle',
        component: StudentComponent,
        canActivate: [AuthGuard],
        data: { permission: 21 }
      },
      {
        path: 'editar',
        component: UpdateStudentComponent,
        canActivate: [AuthGuard],
        data: { permission: 21 }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {}
