import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './components/login/login.component';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { AuthService } from './shared/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

@NgModule({
  declarations: [LoginComponent, UnauthorizedComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AuthRoutingModule, HttpClientModule, AntDesignModule],
  providers: [AuthService, AuthGuard]
})
export class LoginModule {}
