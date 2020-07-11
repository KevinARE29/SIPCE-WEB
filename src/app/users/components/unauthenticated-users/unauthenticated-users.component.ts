import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from '../../shared/user.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { Role } from 'src/app/roles/shared/role.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { subMonths, differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-unauthenticated-users',
  templateUrl: './unauthenticated-users.component.html',
  styleUrls: ['./unauthenticated-users.component.css']
})
export class UnauthenticatedUsersComponent implements OnInit {
  searchParams: User;
  roleSearch: number;
  roles: Role[];
  loading = false;
  listOfDisplayData: User[];
  pagination: Pagination;
  dateFormat = 'dd/MM/yyyy';

  constructor(private userService: UserService, private notification: NzNotificationService) {}

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    this.searchParams = new User();
    this.searchParams.createdAt = [date, currentDate];
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

    this.userService
      .getUnauthorizedUsers(params, this.searchParams, params.pageIndex !== this.pagination.page)
      .subscribe(
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
            this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
              nzDuration: 0
            });
          }
        }
      );
  }

  search(): void {
    this.loading = true;
    this.searchParams.roles['0'].id = this.roleSearch;

    this.userService.getUnauthorizedUsers(null, this.searchParams, false).subscribe(
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
          this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
            nzDuration: 0
          });
        }
      }
    );
  }

  onChangeDatePicker(result: Date[]): void {
    this.searchParams.createdAt[0] = result[0];
    this.searchParams.createdAt[1] = result[1];
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };
}
