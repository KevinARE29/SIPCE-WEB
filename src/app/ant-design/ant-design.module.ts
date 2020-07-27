/*  
  Path: app/ant-design/ant-design.module.ts
  Objective: Contains Ant Design modules used in the app
  Author: Esme López
*/

import { NgModule } from '@angular/core';

import { IconsProviderModule } from '../icons-provider.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';

import es from '@angular/common/locales/es';

registerLocaleData(es);

const ngZorro = [
  IconsProviderModule,
  NzLayoutModule,
  NzGridModule,
  NzMenuModule,
  FormsModule,
  HttpClientModule,
  NzAvatarModule,
  NzDropDownModule,
  NzButtonModule,
  NzPageHeaderModule,
  NzFormModule,
  NzCardModule,
  NzInputModule,
  NzInputNumberModule,
  NzGridModule,
  NzAlertModule,
  NzCheckboxModule,
  NzToolTipModule,
  NzModalModule,
  NzMessageModule,
  NzTableModule,
  NzDividerModule,
  NzSpinModule,
  NzTransferModule,
  NzNotificationModule,
  NzSelectModule,
  NzDatePickerModule,
  NzUploadModule,
  NzPopconfirmModule,
  NzSwitchModule,
  NzTagModule,
  NzListModule,
  NzTabsModule
];

@NgModule({
  imports: [ngZorro],
  exports: [ngZorro],
  providers: [{ provide: NZ_I18N, useValue: es_ES }]
})
export class AntDesignModule {}
