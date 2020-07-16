import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AntDesignModule } from '../ant-design/ant-design.module';

import { UsersRoutingModule } from './users-routing.module';
import { UploadUsersComponent } from './components/upload-users/upload-users.component';
import { UsersComponent } from './components/users/users.component';
import { UnauthenticatedUsersComponent } from './components/unauthenticated-users/unauthenticated-users.component';
import { UserComponent } from './components/user/user.component';

@NgModule({
  declarations: [UploadUsersComponent, UsersComponent, UnauthenticatedUsersComponent, UserComponent],
  imports: [CommonModule, ReactiveFormsModule, AntDesignModule, UsersRoutingModule]
})
export class UsersModule {}
