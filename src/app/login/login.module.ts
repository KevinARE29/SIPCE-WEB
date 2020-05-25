import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './components/login.component';
// import { ForbiddenComponent } from './components/forbidden.component';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { AuthService } from './shared/auth.service';
import { AuthGuard } from './guards/auth.guard';
// import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    HttpClientModule,
    AntDesignModule,
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
})
export class LoginModule { }
