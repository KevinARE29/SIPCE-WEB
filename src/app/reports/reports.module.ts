import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { ReportsRoutingModule } from './reports-routing.module';
import { SessionTypeComponent } from './components/session-type/session-type.component';

@NgModule({
  declarations: [SessionTypeComponent],
  imports: [AntDesignModule, CommonModule, ReportsRoutingModule]
})
export class ReportsModule {}
