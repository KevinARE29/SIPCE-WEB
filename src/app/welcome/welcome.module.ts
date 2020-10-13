import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './components/welcome.component';
import { ConfirmRequestComponent } from './components/confirm-request/confirm-request.component';

@NgModule({
  declarations: [WelcomeComponent, ConfirmRequestComponent],
  imports: [AntDesignModule, CommonModule, ReactiveFormsModule, WelcomeRoutingModule]
})
export class WelcomeModule {}
