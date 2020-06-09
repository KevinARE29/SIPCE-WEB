import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule }    from '@angular/common/http';

import { AntDesignModule } from '../ant-design/ant-design.module';
// routing and components
import { ResetPasswordComponent } from './components/reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AntDesignModule,
    ResetPasswordRoutingModule
  ]
})
export class ResetPasswordModule { }
