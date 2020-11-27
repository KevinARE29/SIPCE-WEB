import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { HttpClientModule } from '@angular/common/http';

import { DisciplinaryCatalogRoutingModule } from './disciplinary-catalog-routing.module';
import { SanctionComponent } from './components/sanction/sanction.component';
import { FaultComponent } from './components/fault/fault.component';


@NgModule({
  declarations: [SanctionComponent, FaultComponent],
  imports: [
    CommonModule,
    DisciplinaryCatalogRoutingModule,
    HttpClientModule,
    AntDesignModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DisciplinaryCatalogModule {}
