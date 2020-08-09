import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { SchoolYearRoutingModule } from './school-year-routing.module';
import { SchoolYearComponent } from './components/school-year/school-year.component';
import { AcademicAssignmentsComponent } from './components/academic-assignments/academic-assignments.component';
import { CycleCoordinatorsComponent } from './components/cycle-coordinators/cycle-coordinators.component';
import { HeadTeachersComponent } from './components/head-teachers/head-teachers.component';
import { CounselorsComponent } from './components/counselors/counselors.component';
import { NewSchoolYearSummaryComponent } from './components/new-school-year-summary/new-school-year-summary.component';
import { SchoolYearEndSummaryComponent } from './components/school-year-end-summary/school-year-end-summary.component';

@NgModule({
  declarations: [
    SchoolYearComponent,
    AcademicAssignmentsComponent,
    CycleCoordinatorsComponent,
    HeadTeachersComponent,
    CounselorsComponent,
    NewSchoolYearSummaryComponent,
    SchoolYearEndSummaryComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, AntDesignModule, SchoolYearRoutingModule]
})
export class SchoolYearModule { }
