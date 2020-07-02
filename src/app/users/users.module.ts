import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UploadUsersComponent } from './components/upload-users/upload-users.component';

@NgModule({
  declarations: [UploadUsersComponent],
  imports: [CommonModule, UsersRoutingModule]
})
export class UsersModule {}
