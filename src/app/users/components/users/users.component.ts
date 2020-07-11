import { Component, OnInit } from '@angular/core';
import { User } from './../../shared/user.model.ts';
import { Role } from 'src/app/roles/shared/role.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { UserService } from '../../shared/user.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  searchParams: User;
  roleSearch: number;
  roles: Role[];
  loading = false;
  listOfDisplayData: User[];
  pagination: Pagination;

  constructor(private userService: UserService, private notification: NzNotificationService) {}

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.searchParams = new User();
    this.searchParams.roles = new Array<Role>();
    this.searchParams.roles.push(new Role());
    this.searchParams.active = false;

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  getUsers(params: NzTableQueryParams): void {
    this.loading = true;
    this.searchParams.roles['0'].id = this.roleSearch;

    this.userService.getUsers(params, this.searchParams, params.pageIndex !== this.pagination.page).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'];

        // Create array of roles
        this.roles = new Array<Role>();
        this.listOfDisplayData.forEach((data) => {
          data.roles.forEach((rol) => {
            this.roles.push(rol);
          });
        });

        // Delete duplicates
        this.roles = this.roles.filter(
          (role, index, self) => index === self.findIndex((t) => t.id === role.id && t.name === role.name)
        );

        this.loading = false;
      },
      (error) => {
        this.loading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al recargar la bitácora de accesos.', error.message, {
            nzDuration: 0
          });
        }
      }
    );
  }

  search(): void {
    this.loading = true;
    this.searchParams.roles['0'].id = this.roleSearch;

    this.userService.getUsers(null, this.searchParams, false).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'];
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al recargar la bitácora de accesos.', error.message, {
            nzDuration: 0
          });
        }
      }
    );
  }
}
