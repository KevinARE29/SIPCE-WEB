import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule }    from '@angular/common/http';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { SecurityPoliciesRoutingModule } from './security-policies-routing.module';
import { SecurityPoliciesComponent } from './components/security-policies.component';

@NgModule({
  declarations: [
    SecurityPoliciesComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AntDesignModule,
    SecurityPoliciesRoutingModule
  ]
})
export class SecurityPoliciesModule { }
