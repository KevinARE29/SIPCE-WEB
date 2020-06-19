import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ResetPasswordComponent } from './components/reset-password.component';

import { PasswordRoutingModule } from './reset-password-routing.module';
import { AntDesignModule } from '../ant-design/ant-design.module';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    PasswordRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AntDesignModule
  ]
})
export class ResetPasswordModule { }
