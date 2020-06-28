import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ResetPasswordComponent } from './components/reset-password.component';

import { PasswordRoutingModule } from './reset-password-routing.module';
import { AntDesignModule } from '../ant-design/ant-design.module';
import { UpgradePasswordComponent } from './components/upgrade-password/upgrade-password.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { ResetPswComponent } from './components/reset-psw/reset-psw.component';

@NgModule({
  declarations: [ResetPasswordComponent, UpgradePasswordComponent, UpdatePasswordComponent, ResetPswComponent],
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
