import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './components/roles/roles.component';

@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    AntDesignModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
