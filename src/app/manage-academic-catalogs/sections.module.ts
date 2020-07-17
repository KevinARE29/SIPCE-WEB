import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { HttpClientModule } from '@angular/common/http';

import { ShowSectionsComponent } from './components/show-sections/show-sections.component';
import { SectionsRoutingModule } from './sections-routing.module';
import { ShowCyclesComponent } from './components/show-cycles/show-cycles.component';

@NgModule({
  declarations: [ShowSectionsComponent, ShowCyclesComponent],
  imports: [CommonModule, SectionsRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, AntDesignModule]
})
export class SectionsModule {}
