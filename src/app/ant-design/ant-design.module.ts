import { NgModule } from '@angular/core';

import { IconsProviderModule } from '../icons-provider.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert';

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
  NzDropDownModule,
  NzButtonModule,
  NzPageHeaderModule,
  NzFormModule,
  NzCardModule,
  NzInputModule,
  NzInputNumberModule,
  NzGridModule,
  NzAlertModule,
];

@NgModule({
  imports: [ngZorro],
  exports: [ngZorro],
  providers: [{ provide: NZ_I18N, useValue: es_ES }],
})
export class AntDesignModule { }
