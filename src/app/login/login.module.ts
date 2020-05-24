import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
//componentes
import { LoginComponent } from './components/login.component';
//ant-design
import { AntDesignModule } from '../ant-design/ant-design.module';
// servicios
import { AuthService } from './shared/auth.service';


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
  ],
})
export class LoginModule { }
