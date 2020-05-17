import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { SecurityPoliciesRoutingModule } from './security-policies-routing.module';
import { SecurityPoliciesComponent } from './components/security-policies.component';

@NgModule({
  declarations: [
    SecurityPoliciesComponent
  ],
  imports: [
    CommonModule,
    AntDesignModule,
    SecurityPoliciesRoutingModule
  ]
})
export class SecurityPoliciesModule { }
