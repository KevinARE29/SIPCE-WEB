import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

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
          if(err.StatusCode === 401){
            this.router.navigate(['login/error401']);
          } else if( err.StatusCode === 403){
            this.router.navigate(['login/error403']);
          } else if(err.StatusCode >= 500 && err.StatusCode <= 599){
            this.router.navigate(['login/error500']);
          } else{
            if(typeof err.message === 'string')
              this.message.error(err.message);
            else
            err.message.forEach(element => { this.message.error(element); });
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
        },
        err => {          
          if(err.StatusCode === 401){
            this.router.navigate(['login/error401']);
          } else if( err.StatusCode === 403){
            this.router.navigate(['login/error403']);
          } else if(err.StatusCode >= 500 && err.StatusCode <= 599){
            this.router.navigate(['login/error500']);
          } else{
            if(typeof err.message === 'string')
              this.message.error(err.message);
            else
            err.message.forEach(element => { this.message.error(element); });
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
        },
        err => {          
          if(err.StatusCode === 401){
            this.router.navigate(['login/error401']);
          } else if( err.StatusCode === 403){
            this.router.navigate(['login/error403']);
          } else if(err.StatusCode >= 500 && err.StatusCode <= 599){
            this.router.navigate(['login/error500']);
          } else{
            if(typeof err.message === 'string')
              this.message.error(err.message);
            else
            err.message.forEach(element => { this.message.error(element); });
          }
        }
      )
  }  

  /* ---    Secondary options      --- */
  getRole(id: number){
    this.router.navigate(['roles/'+id]);
  }

  deleteRole(){
    
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
        }).catch(e => {
          if(e.statusCode === 401){
            this.router.navigate(['login/error401']);
          } else if( e.statusCode === 403){
            this.router.navigate(['login/error403']);
          } else if(e.statusCode >= 500 && e.statusCode <= 599){
            this.router.navigate(['login/error500']);
          } else{
              if(typeof e.message === 'string')
                this.message.error(e.message);
              else
                e.message.forEach(element => { this.message.error(element); });
          }
        })
    });
  }
}
