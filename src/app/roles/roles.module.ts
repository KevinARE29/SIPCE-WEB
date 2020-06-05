import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './components/roles/roles.component';
import { RoleComponent } from './components/role/role.component';

@NgModule({
  declarations: [RolesComponent, RoleComponent],
  imports: [
    CommonModule,
    AntDesignModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
