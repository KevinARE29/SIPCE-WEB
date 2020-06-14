import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { LogsRoutingModule } from './logs-routing.module';
import { AccessLogComponent } from './components/access-log/access-log.component';
import { LogsRootComponent } from './components/logs-root.component';

@NgModule({
  declarations: [AccessLogComponent, LogsRootComponent],
  imports: [
    CommonModule,
    AntDesignModule,
    LogsRoutingModule
  ]
})
export class LogsModule { }
