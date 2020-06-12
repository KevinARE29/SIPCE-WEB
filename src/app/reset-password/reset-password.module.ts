import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { AntDesignModule } from '../ant-design/ant-design.module';
// routing and components
import { ResetPasswordComponent } from './components/reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
// servicios
import { ResetPasswordService } from './shared/reset-password.service';

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AntDesignModule,
    FormsModule, 
    ReactiveFormsModule,
    ResetPasswordRoutingModule
  ],
   providers: [
    ResetPasswordService
  ],
})
export class ResetPasswordModule { }
