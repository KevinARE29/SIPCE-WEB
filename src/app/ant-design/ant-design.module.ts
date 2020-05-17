import { NgModule } from '@angular/core';

import { IconsProviderModule } from '../icons-provider.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

registerLocaleData(es);

const ngZorro = [
  IconsProviderModule,
  NzLayoutModule,
  NzMenuModule,
  FormsModule,
  HttpClientModule,
  NzAvatarModule,
  NzDropDownModule
];

@NgModule({
  imports: [ngZorro],
  exports: [ngZorro],
  providers: [{ provide: NZ_I18N, useValue: es_ES }]
})
export class AntDesignModule { }
