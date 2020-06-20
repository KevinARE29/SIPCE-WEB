import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { LogsRoutingModule } from './logs-routing.module';
import { AccessLogComponent } from './components/access-log/access-log.component';
import { LogsRootComponent } from './components/logs-root.component';
import { ActionsLogComponent } from './components/actions-log/actions-log.component';

@NgModule({
  declarations: [AccessLogComponent, LogsRootComponent, ActionsLogComponent],
  imports: [
    CommonModule,
    AntDesignModule,
    LogsRoutingModule
  ]
})
export class LogsModule { }
