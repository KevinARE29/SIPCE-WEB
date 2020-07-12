import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/user.model';
import { Role } from 'src/app/roles/shared/role.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { UserService } from '../../shared/user.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  confirmModal?: NzModalRef;

  constructor(
    private userService: UserService,
    private message: NzMessageService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

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

    this.userService.getUsers(null, this.searchParams, false).subscribe(
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
                nzDuration: 0
              });
            }
          })
    });
  }
}
