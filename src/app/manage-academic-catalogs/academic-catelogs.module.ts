import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { HttpClientModule } from '@angular/common/http';

import { ShowSectionsComponent } from './components/show-sections/show-sections.component';
import { ShowGradesComponent } from './components/show-grades/show-grades.component';
import { ShowShiftComponent } from './components/show-shift/show-shift.component';
import { ShowPeriodsComponent } from './components/show-periods/show-periods.component';
import { ShowCyclesComponent } from './components/show-cycles/show-cycles.component';

import { AcademicCatalogsRoutingModule } from './academic-catalogs-routing.module';

@NgModule({
  declarations: [
    ShowSectionsComponent,
    ShowCyclesComponent,
    ShowPeriodsComponent,
    ShowShiftComponent,
    ShowGradesComponent
  ],
  imports: [
    CommonModule,
    AcademicCatalogsRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AntDesignModule
  ]
})
export class AcademicCatelogsModule {}
