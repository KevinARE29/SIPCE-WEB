/* 
  Path: app/roles/components/role/role.component.ts
  Objective: Define the behavior of an role
  Author: Esme López 
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { TransferItem } from 'ng-zorro-antd/transfer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { AuthService } from '../../../login/shared/auth.service';
import { PermissionService } from './../../shared/permission.service';
import { Permission } from '../../../shared/permission.model';
import { AppPermission } from '../../shared/app-permission.model';
import { RoleService } from '../../shared/role.service';
import { Role } from '../../shared/role.model';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  id: number;
  permissions: Array<Permission> = [];
  appPermissions: Array<AppPermission> = [];
  list: TransferItem[] = [];
  role: Role = new Role();
  btnLoading = false;
  transferLoading = false;
  roleForm!: FormGroup;
  newRole: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.setPermissions();
    this.gateway();

    if (this.id === 0) this.setData();
  }
  /* ---      Control page permissions      --- */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    this.permissions.push(new Permission(6, 'Create role'));
    this.permissions.push(new Permission(7, 'Read role'));
    this.permissions.push(new Permission(8, 'Update role'));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);
      p.allow = index === -1 ? false : true;
    });
  }

  checkPermission(id: number): boolean {
    const index = this.permissions.find((p) => p.id === id);
    return index.allow;
  }

  /* ---      Control actions      --- */
  gateway(): void {
    this.route.paramMap.subscribe((params) => {
      const param: string = params.get('role');

      this.roleForm = this.fb.group({
        name: [
          null,
          [Validators.required, Validators.maxLength(32), Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$')]
        ]
      });

      if (typeof param === 'string' && !Number.isNaN(Number(param))) {
        this.id = Number(param);
        this.getAppPermissions();
      } else {
        this.router.navigateByUrl('/role/' + this.id, { skipLocationChange: true });
      }
    });
  }

  getAppPermissions(): void {
    this.transferLoading = true;
    this.permissionService.getPermissions().subscribe((data) => {
      this.appPermissions = data['data'];

      if (this.id === 0) this.setData();
      else this.getRole();

      this.transferLoading = false;
    });
  }

  submitForm(): void {
    for (const i in this.roleForm.controls) {
      this.roleForm.controls[i].markAsDirty();
      this.roleForm.controls[i].updateValueAndValidity();
    }

    if (this.roleForm.valid) {
      this.role.name = this.roleForm.controls['name'].value;

      if (this.id === 0) {
        this.createRole();
      } else if (this.id > 5) {
        this.updateRole();
      }
    }
  }

  createRole(): void {
    this.btnLoading = true;
    this.transformSelectedItems();

    this.roleService.createRole(this.role).subscribe(
      (data) => {
        this.role.id = data['data'].id;
        this.message.success('Role ' + data['data'].name + ' creado con éxito');
        this.btnLoading = false;

        this.router.navigateByUrl('/roles/' + this.role.id);
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al crear el rol. Por favor verifique lo siguiente:',
            err.message,
            { nzDuration: 30000 }
          );
        }

        this.btnLoading = false;
      }
    );
  }

  getRole(): void {
    this.transferLoading = true;
    this.roleService.getRole(this.id).subscribe(
      (data) => {
        this.transferLoading = false;
        this.role = data;

        this.roleForm.get('name')?.setValue(this.role.name);

        this.setData();
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (err.statusCode === 404) {
          this.router.navigateByUrl('/role/' + this.id, { skipLocationChange: true });
        } else if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al obtener el rol. Por favor verifique lo siguiente:',
            err.message,
            { nzDuration: 30000 }
          );
        }
      }
    );
  }

  updateRole(): void {
    this.btnLoading = true;
    this.transformSelectedItems();

    this.roleService.updateRole(this.role).subscribe(
      (data) => {
        this.role = data['data'];
        this.message.success('Role ' + this.role.name + ' actualizado con éxito');
        this.btnLoading = false;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (err.statusCode === 404) {
          this.router.navigateByUrl('/role/' + this.id, { skipLocationChange: true });
        } else if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al actualizar el rol. Por favor verifique lo siguiente:',
            err.message,
            { nzDuration: 30000 }
          );
        }
        this.btnLoading = false;
      }
    );
  }

  /* ---      Transfer element     --- */
  setData(): void {
    const ret: TransferItem[] = [];

    if (this.id == 0) {
      this.appPermissions.forEach((p) => {
        ret.push({
          key: p.id,
          title: p.name,
          description: p.codename,
          direction: 'left'
        });
      });
    } else {
      this.appPermissions.forEach((p) => {
        ret.push({
          key: p.id,
          title: p.name,
          description: p.codename,
          direction: this.role.permissions.find((x) => x === p.id) ? 'right' : 'left',
          disabled: this.id >= 1 && this.id <= 5 ? true : false
        });
      });
    }

    this.list = ret;
  }

  transformSelectedItems(): void {
    this.role.permissions = Array<number>();
    const assignedPermissions = this.list.filter((x) => x.direction === 'right');

    assignedPermissions.forEach((p) => {
      this.role.permissions.push(p.key);
    });
  }

  filterOption(inputValue: string, item: any): boolean {
    return item.description.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
  }
}
