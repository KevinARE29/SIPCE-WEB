import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { HttpClientModule } from '@angular/common/http';

import { ShowSectionsComponent } from './components/show-sections/show-sections.component';
import { SectionsRoutingModule } from './sections-routing.module';

@NgModule({
  declarations: [ShowSectionsComponent],
  imports: [CommonModule, SectionsRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, AntDesignModule]
})
export class SectionsModule {}
