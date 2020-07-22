import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { StudentsRoutingModule } from './students-routing.module';
import { UploadStudentsComponent } from './components/upload-students/upload-students.component';

@NgModule({
  declarations: [UploadStudentsComponent],
  imports: [CommonModule, AntDesignModule, StudentsRoutingModule]
})
export class StudentsModule { }