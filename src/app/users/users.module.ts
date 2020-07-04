import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { UsersRoutingModule } from './users-routing.module';
import { UploadUsersComponent } from './components/upload-users/upload-users.component';

@NgModule({
  declarations: [UploadUsersComponent],
  imports: [CommonModule, AntDesignModule, UsersRoutingModule]
})
export class UsersModule {}