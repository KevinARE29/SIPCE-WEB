import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { AntDesignModule } from './../ant-design/ant-design.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [AntDesignModule, CommonModule, DashboardRoutingModule, ChartsModule]
})
export class DashboardModule {}
