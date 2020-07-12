import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from '../../shared/user.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { Role } from 'src/app/roles/shared/role.model';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { subMonths, differenceInCalendarDays } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Permission } from 'src/app/shared/permission.model';
import { AuthService } from 'src/app/login/shared/auth.service';

export interface Data {
  user: User;
  disabled: boolean;
}

@Component({
  selector: 'app-unauthenticated-users',
  templateUrl: './unauthenticated-users.component.html',
  styleUrls: ['./unauthenticated-users.component.css']
})
export class UnauthenticatedUsersComponent implements OnInit {
  permissions: Array<Permission> = [];
  searchParams: User;
  roleSearch: number;
  roles: Role[];
  loading = false;
  dateFormat = 'dd/MM/yyyy';

  // Table variables
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  filteredList: Data[] = [];
  pagination: Pagination;

  // Modal
  isVisible = false;
  isConfirmLoading = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private message: NzMessageService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.init();
    this.setPermissions();
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

  /* ---      Control page permissions      --- */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    this.permissions.push(new Permission(12, 'Generate credentials'));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);

      p.allow = index == -1 ? false : true;
    });
  }

  checkPermission(id: number): boolean {
    const index = this.permissions.find((p) => p.id === id);
    return index.allow;
  }

  /***************      Get data       ***************/
  getUsers(params: NzTableQueryParams): void {
    this.loading = true;
    this.searchParams.roles['0'].id = this.roleSearch;

    this.userService
      .getUnauthorizedUsers(params, this.searchParams, params.pageIndex !== this.pagination.page)
      .subscribe(
        (data) => {
          this.pagination = data['pagination'];
          this.listOfData = data['data'];

          // Create array of roles
          this.roles = new Array<Role>();
          this.listOfData.forEach((data) => {
            data.user.roles.forEach((rol) => {
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
        this.listOfData = data['data'];

        // Create array of roles
        this.roles = new Array<Role>();
        this.listOfData.forEach((data) => {
          data.user.roles.forEach((rol) => {
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

  /***************      Manage checked column       ***************/
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: Data[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ user }) => this.setOfCheckedId.has(user.id));
    this.indeterminate = listOfEnabledData.some(({ user }) => this.setOfCheckedId.has(user.id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ user }) => this.updateCheckedSet(user.id, checked));
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    this.loading = true;
    this.isConfirmLoading = true;

    this.userService.generateCredentials(Array.from(this.setOfCheckedId)).subscribe(
      () => {
        this.search();
        this.isVisible = false;
        this.isConfirmLoading = false;
        this.loading = false;
        this.setOfCheckedId.clear();
        this.refreshCheckedStatus();
        this.message.success('Credenciales generadas con éxito');
      },
      (error) => {
        this.isVisible = false;
        this.isConfirmLoading = false;
        this.loading = false;

        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al crear las credenciales.', error.message, {
            nzDuration: 0
          });
        }
      }
    );
  }

  /**********      Custom modal       **********/
  showModal(): void {
    this.filteredList = this.listOfData.filter((x) => Array.from(this.setOfCheckedId).includes(x.user.id));
    this.isVisible = true;
  }

  handleOk(): void {
    this.sendRequest();
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
