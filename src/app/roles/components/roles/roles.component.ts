/* 
  Path: app/roles/components/roles/roles.component.ts
  Objective: Define the roles behavior
  Author: Esme López 
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { RoleService } from './../../shared/role.service';
import { AuthService } from '../../../login/shared/auth.service';
import { Permission } from '../../../shared/permission.model';

import { Role } from './../../shared/role.model';
import { Pagination } from './../../../shared/pagination.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  permissions: Array<Permission> = [];
  roles: Role[];
  pagination: Pagination;
  loading = false;
  searchValue = '';
  listOfDisplayData: Role[];
  tableSize = 'small'; 
  icon = 'search';
  color = 'primary';
  confirmModal?: NzModalRef;
  
  constructor(
    private router: Router,
    private roleService: RoleService,
    private authService: AuthService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void { 
    this.pagination = new Pagination();
    this.setPermissions();
    this.getRoles();
  }

  /* ---      Control page permissions      --- */
  setPermissions(){
    let token = this.authService.getToken();
    let content = this.authService.jwtDecoder(token);
 
    let permissions = content.permissions;

    this.permissions.push(new Permission(6, "Create role"));
    this.permissions.push(new Permission(7, "Read role"));
    this.permissions.push(new Permission(8, "Update role"));
    this.permissions.push(new Permission(9, "Delete role"));

    this.permissions.forEach(p => {
      let index = permissions.indexOf(p.id);
      
      p.allow = (index == -1)? false : true;
    });
  }

  checkPermission(id: number){
    let index = this.permissions.find( p => p.id === id);
    return index.allow;
  }

  /* ---      Main options      --- */
  getRoles(){
    this.loading = true;
    this.roleService.getRoles()
      .subscribe(
        data => {
          this.roles = data['data'];
          this.pagination = data['pagination'];
          this.listOfDisplayData = [...this.roles];
          this.loading = false;
        },
        err => {          
          let statusCode = err.statusCode;
          let notIn = [401, 403];
          
          if(!notIn.includes(statusCode) && statusCode<500){
            this.notification.create(
              'error',
              'Ocurrió un error al obtener los roles.',
              err.message,
              { nzDuration: 0 }
            );
          }
        }
      )
  }

  recharge(params: NzTableQueryParams){
    this.loading = true;

    this.roleService.searchRoles(params, this.searchValue, params.pageIndex !== this.pagination.page)
      .subscribe(
        data => {
          this.roles = data['data'];
          this.pagination = data['pagination'];
          this.listOfDisplayData = [...this.roles];
          this.loading = false;
        }, err => {          
          let statusCode = err.statusCode;
          let notIn = [401, 403];
          
          if(!notIn.includes(statusCode) && statusCode<500){
            this.notification.create(
              'error',
              'Ocurrió un error al obtener los roles.',
              err.message,
              { nzDuration: 0 }
            );
          }
        }
      )
  }

  search(): void {
    this.loading = true;
    
    this.roleService.searchRoles(null, this.searchValue, false)
      .subscribe(
        data => {
          this.roles = data['data'];
          this.pagination = data['pagination'];
          this.listOfDisplayData = [...this.roles];
          this.loading = false;
        }, err => {          
          let statusCode = err.statusCode;
          let notIn = [401, 403];
          
          if(!notIn.includes(statusCode) && statusCode<500){
            this.notification.create(
              'error',
              'Ocurrió un error al filtrar roles.',
              err.message,
              { nzDuration: 0 }
            );
          }
        }
      )
  }  

  /* ---    Secondary options      --- */
  getRole(id: number){
    this.router.navigate(['roles/'+id]);
  }

  showConfirm(id: number): void {
    let element = this.roles.find(x => x.id === id);

    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar el rol "${element.name}"?`,
      nzContent: (element.usersCount > 0)? `Eliminará el rol "${element.name}", el rol se ha asignado a ${element.usersCount} usuarios. La acción no puede deshacerse.`:
                                           `Eliminará el rol "${element.name}". La acción no puede deshacerse.`,

      nzOnOk: () =>
      this.roleService.deleteRole(id)      
        .toPromise().then(r => {
            this.message.success(`El rol ${element.name} ha sido eliminado`);
            this.getRoles();
        }).catch(err => {
          let statusCode = err.statusCode;
          let notIn = [401, 403];
          
          if(!notIn.includes(statusCode) && statusCode<500){
            this.notification.create(
              'error',
              'Ocurrió un error al eliminar el rol.',
              err.message,
              { nzDuration: 0 }
            );
          }
        })
    });
  }
}
