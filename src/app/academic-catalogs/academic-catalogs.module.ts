import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { HttpClientModule } from '@angular/common/http';

import { SectionsComponent } from './components/sections/sections.component';
import { GradesComponent } from './components/grades/grades.component';
import { ShowShiftComponent } from './components/show-shift/show-shift.component';
import { PeriodsComponent } from './components/periods/periods.component';
import { CyclesComponent } from './components/cycles/cycles.component';

import { AcademicCatalogsRoutingModule } from './academic-catalogs-routing.module';

@NgModule({
  declarations: [SectionsComponent, CyclesComponent, PeriodsComponent, ShowShiftComponent, GradesComponent],
  imports: [
    CommonModule,
    AcademicCatalogsRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AntDesignModule
  ]
})
export class AcademicCatalogsModule {}
