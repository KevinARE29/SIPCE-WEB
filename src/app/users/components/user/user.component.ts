import { Component, OnInit } from '@angular/core';
import { PermissionService } from 'src/app/roles/shared/permission.service';
import { RoleService } from 'src/app/roles/shared/role.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/login/shared/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Permission } from 'src/app/shared/permission.model';
import { AppPermission } from 'src/app/roles/shared/app-permission.model';
import { TransferItem } from 'ng-zorro-antd/transfer';
import { User } from '../../shared/user.model';
import { Role } from 'src/app/roles/shared/role.model';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  id: number;
  edit = false;
  loading = false;
  // Transfers
  permissions: Array<Permission> = [];
  appPermissions: Array<AppPermission> = [];
  appRoles: Array<Role> = [];
  permissionsList: TransferItem[] = [];
  rolesList: TransferItem[] = [];
  // Common variables
  user: User = new User();
  btnLoading = false;
  userForm!: FormGroup;
  newUser: string;
  userRoles: Array<number> = [];
  userPermissions: Array<number> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private roleService: RoleService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private userService: UserService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.setPermissions();
    this.gateway();
  }

  /* ---      Control page permissions      --- */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    this.permissions.push(new Permission(3, 'Create user'));
    this.permissions.push(new Permission(16, 'View user'));
    this.permissions.push(new Permission(15, 'Update user'));

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
      const param: string = params.get('user');

      this.userForm = this.fb.group({
        code: [null, [Validators.required, Validators.maxLength(32)]],
        username: [null, [Validators.required, Validators.maxLength(64)]],
        firstname: [null, [Validators.required, Validators.maxLength(128)]],
        lastname: [null, [Validators.required, Validators.maxLength(128)]],
        email: [null, [Validators.required, Validators.maxLength(128), Validators.email]]
      });

      if (typeof param === 'string' && !Number.isNaN(Number(param))) {
        this.id = Number(param);

        if (this.id === 0) {
          this.getRoles();
          this.getAppPermissions();
        } else if (this.id > 0) {
          this.getUser();
        }
      } else {
        this.router.navigateByUrl('/usuario/' + param, { skipLocationChange: true });
      }
    });
  }

  getRoles(): void {
    this.loading = true;
    this.roleService.getAllRoles().subscribe((data) => {
      this.appRoles = data['data'];
      this.setRolesData();
      this.loading = false;
    });
  }

  getAppPermissions(): void {
    this.loading = true;
    this.permissionService.getPermissions().subscribe((data) => {
      this.appPermissions = data['data'];
      this.setPermissionsData();
      this.loading = false;
    });
  }

  allowEdition(): void {
    this.userForm.get('code')?.setValue(this.user.code);
    this.userForm.get('username')?.setValue(this.user.username);
    this.userForm.get('firstname')?.setValue(this.user.firstname);
    this.userForm.get('lastname')?.setValue(this.user.lastname);
    this.userForm.get('email')?.setValue(this.user.email);
  }

  getUser(): void {
    this.loading = true;
    this.userService.mergeUserData(this.id).subscribe(
      (data) => {
        this.appRoles = data.roles.data;
        this.appPermissions = data.permissions.data;
        this.user = data.user.data;

        this.setRolesData();
        this.setPermissionsData();
        this.loading = false;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (err.statusCode === 404) {
          this.router.navigateByUrl('/usuario/' + this.id, { skipLocationChange: true });
        } else if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al obtener al usuario. Por favor verifique lo siguiente:',
            err.message,
            { nzDuration: 0 }
          );
        }
      }
    );
  }

  submitForm(): void {
    for (const i in this.userForm.controls) {
      this.userForm.controls[i].markAsDirty();
      this.userForm.controls[i].updateValueAndValidity();
    }

    if (this.userForm.valid) {
      this.user.code = this.userForm.controls['code'].value;
      this.user.username = this.userForm.controls['username'].value;
      this.user.firstname = this.userForm.controls['firstname'].value;
      this.user.lastname = this.userForm.controls['lastname'].value;
      this.user.email = this.userForm.controls['email'].value;

      if (this.id === 0) {
        this.createUser();
      } else if (this.id > 0) {
        this.updateUser();
      }
    }
  }

  createUser(): void {
    this.btnLoading = true;
    this.transformSelectedItems();

    this.userService.createUser(this.user).subscribe(
      (data) => {
        this.user.id = data['data'].id;
        this.id = this.user.id;
        this.message.success('Usuario ' + data['data'].username + ' creado con éxito');
        this.btnLoading = false;

        this.router.navigateByUrl('/usuarios/' + this.user.id);
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al crear el usuario. Por favor verifique lo siguiente:',
            err.message,
            { nzDuration: 0 }
          );
        }

        this.btnLoading = false;
      }
    );
  }

  updateUser(): void {
    this.btnLoading = true;
    this.transformSelectedItems();

    this.userService.updateUser(this.user).subscribe(
      (data) => {
        this.user.id = data['data'].id;
        this.message.success('Usuario ' + data['data'].username + ' actualizado con éxito');
        this.btnLoading = false;

        this.router.navigateByUrl('/usuarios/' + this.user.id);
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create(
            'error',
            'Ocurrió un error al actualizar al usuario. Por favor verifique lo siguiente:',
            err.message,
            { nzDuration: 0 }
          );
        }

        this.btnLoading = false;
      }
    );
  }

  /* ---      Transfer element     --- */
  setPermissionsData(): void {
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
          direction: this.user.permissions.find((x) => x.id === p.id) ? 'right' : 'left'
        });
      });
    }

    this.permissionsList = ret;
  }

  setRolesData(): void {
    const ret: TransferItem[] = [];

    if (this.id == 0) {
      this.appRoles.forEach((r) => {
        ret.push({
          key: r.id,
          title: r.name,
          description: r.name,
          direction: 'left'
        });
      });
    } else {
      this.appRoles.forEach((r) => {
        ret.push({
          key: r.id,
          title: r.name,
          description: r.name,
          direction: this.user.roles.find((x) => x.id === r.id) ? 'right' : 'left'
        });
      });
    }

    this.rolesList = ret;
  }

  transformSelectedItems(): void {
    this.user.permissions = Array<Permission>();
    this.user.roles = Array<Role>();

    const assignedRoles = this.rolesList.filter((x) => x.direction === 'right');
    const assignedPermissions = this.permissionsList.filter((x) => x.direction === 'right');

    assignedRoles.forEach((r) => {
      this.user.roles.push(r.key);
    });

    assignedPermissions.forEach((p) => {
      this.user.permissions.push(p.key);
    });
  }

  filterOption(inputValue: string, item: any): boolean {
    return item.description.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
  }
}
