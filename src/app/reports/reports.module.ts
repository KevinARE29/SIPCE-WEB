import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { ReportsRoutingModule } from './reports-routing.module';
import { SessionTypeComponent } from './components/session-type/session-type.component';
import { ServiceTypeComponent } from './components/service-type/service-type.component';
import { SociometricTestsComponent } from './components/sociometric-tests/sociometric-tests.component';

@NgModule({
  declarations: [SessionTypeComponent, ServiceTypeComponent, SociometricTestsComponent],
  imports: [AntDesignModule, CommonModule, ReportsRoutingModule]
})
export class ReportsModule {}
