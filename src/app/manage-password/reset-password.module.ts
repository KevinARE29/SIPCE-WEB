import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// components
import { ResetPasswordComponent } from './components/reset-password.component';
// shared

// routing 
import { PasswordRoutingModule } from './password-routing.module';
//modules
import { AntDesignModule } from '../ant-design/ant-design.module';
//guard

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
