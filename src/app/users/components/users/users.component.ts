import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/user.model';
import { Role } from 'src/app/roles/shared/role.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { UserService } from '../../shared/user.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/login/shared/auth.service';
import { Permission } from 'src/app/shared/permission.model';
import { RoleService } from 'src/app/roles/shared/role.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  permissions: Array<Permission> = [];
  searchParams: User;
  roleSearch: number;
  roles: Role[];
  loading = false;
  listOfDisplayData: User[];
  pagination: Pagination;
  confirmModal?: NzModalRef;
  currentUser: number;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private roleService: RoleService,
    private message: NzMessageService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.init();
    this.setPermissions();
  }

  init(): void {
    this.searchParams = new User();
    this.searchParams.roles = new Array<Role>();
    this.searchParams.roles.push(new Role());
    this.searchParams.active = false;

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
    this.getRoles();
  }

  /* ------      Control page permissions      ------ */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    // Get current user id
    this.currentUser = content.id;

    this.permissions.push(new Permission(14, 'Delete user'));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);

      p.allow = index == -1 ? false : true;
    });
  }

  checkPermission(id: number): boolean {
    const index = this.permissions.find((p) => p.id === id);
    return index.allow;
  }

  getRoles(): void {
    this.roleService.getAllRoles().subscribe((data) => {
      this.roles = data['data'];
    });
  }

  getUsers(params: NzTableQueryParams): void {
    this.loading = true;
    this.searchParams.roles['0'].id = this.roleSearch;

    this.userService.getUsers(params, this.searchParams, params.pageIndex !== this.pagination.page).subscribe(
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
          this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
            nzDuration: 30000
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
          this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  showConfirm(id: number): void {
    const element = this.listOfDisplayData.find((x) => x.id === id);

    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar el usuario "${element.username}"?`,
      nzContent: `Eliminará el usuario de "${element.firstname} ${element.lastname}". La acción no puede deshacerse. ¿Desea continuar con la acción?`,
      nzOnOk: () =>
        this.userService
          .deleteUser(id)
          .toPromise()
          .then(() => {
            this.message.success(`El usuario ${element.username} ha sido eliminado`);
            this.search();
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar el usuario.', err.message, {
                nzDuration: 30000
              });
            }
          })
    });
  }
}
