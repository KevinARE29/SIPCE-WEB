import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './components/roles/roles.component';
import { RoleComponent } from './components/role/role.component';

@NgModule({
  declarations: [RolesComponent, RoleComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AntDesignModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
