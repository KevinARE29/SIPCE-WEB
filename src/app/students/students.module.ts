import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { StudentsRoutingModule } from './students-routing.module';
import { UploadStudentsComponent } from './components/upload-students/upload-students.component';
import { StudentsComponent } from './components/students/students.component';
import { NewStudentComponent } from './components/new-student/new-student.component';

@NgModule({
  declarations: [UploadStudentsComponent, StudentsComponent, NewStudentComponent],
  imports: [CommonModule, ReactiveFormsModule, AntDesignModule, StudentsRoutingModule]
})
export class StudentsModule { }
