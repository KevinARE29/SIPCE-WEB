/*  
  Path: app/ant-design/ant-design.module.ts
  Objetive: Contains Ant Design modules used in the app
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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
  NzCheckboxModule,
  NzInputNumberModule,
  NzToolTipModule,
  NzButtonModule
];

@NgModule({
  imports: [ngZorro],
  exports: [ngZorro],
  providers: [{ provide: NZ_I18N, useValue: es_ES }]
})
export class AntDesignModule { }
