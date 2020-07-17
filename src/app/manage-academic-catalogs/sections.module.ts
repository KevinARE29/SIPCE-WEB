import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { HttpClientModule } from '@angular/common/http';

import { ShowSectionsComponent } from './components/show-sections/show-sections.component';
import { SectionsRoutingModule } from './sections-routing.module';
import { ShowGradesComponent } from './components/show-grades/show-grades.component';
import { ShowShiftComponent } from './components/show-shift/show-shift.component';
import { ShowPeriodsComponent } from './components/show-periods/show-periods.component';

@NgModule({
  declarations: [ShowSectionsComponent, ShowGradesComponent, ShowShiftComponent, ShowPeriodsComponent],
  imports: [CommonModule, SectionsRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, AntDesignModule]
})
export class SectionsModule {}
