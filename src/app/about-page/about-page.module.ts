import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { HttpClientModule } from '@angular/common/http';

import { AboutPageRoutingModule } from './about-page-routing.module';
import { AboutPageComponent } from './components/about-page.component';

@NgModule({
  declarations: [AboutPageComponent],
  imports: [CommonModule, AboutPageRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, AntDesignModule]
})
export class AboutPageModule {}