import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { UsersRoutingModule } from './users-routing.module';
import { UploadUsersComponent } from './components/upload-users/upload-users.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  declarations: [UploadUsersComponent, UsersComponent],
  imports: [CommonModule, AntDesignModule, UsersRoutingModule]
})
export class UsersModule {}
