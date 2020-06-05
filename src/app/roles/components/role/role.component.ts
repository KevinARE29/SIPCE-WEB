import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TransferItem } from 'ng-zorro-antd/transfer';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private message: NzMessageService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.setPermissions();
    this.gateway();

    if(this.id === 0)
      this.setData();
  }

  /* ---      Control page permissions      --- */
  setPermissions(){
    let token = this.authService.getToken();
    let content = this.authService.jwtDecoder(token);

    let permissions = content.permissions;

    this.permissions.push(new Permission(6, "Create role"));
    this.permissions.push(new Permission(7, "Read role"));
    this.permissions.push(new Permission(8, "Update role"));

    this.permissions.forEach(p => {
      let index = permissions.indexOf(p.id);
      p.allow = (index == -1)? false : true;
    });
  }

  checkPermission(id: number){
    let index = this.permissions.find( p => p.id === id);
    return index.allow;
  }

  /* ---      Control actions      --- */
  gateway(){
    this.route.paramMap.subscribe(params => {
      let param: string = params.get('role');
      
      if (typeof param === "string" && !Number.isNaN(Number(param))) {
        this.id = Number(param);
        this.getAppPermissions();
      } else {
        this.router.navigateByUrl("/roles/{{param}}", { skipLocationChange: true });
      }
    });
  }

  getAppPermissions(){
    this.transferLoading = true;
    this.permissionService.getPermissions()
      .subscribe(
        data => {
          this.appPermissions = data['data'];
          
          if(this.id===0)
            this.setData();
          else
            this.getRole();

          this.transferLoading = false;
        },
        err => {  
          console.log(err);   
        }
      )
  }

  createRole(){
    this.btnLoading = true;
    this.transformSelectedItems();

    this.roleService.createRol(this.role)
      .subscribe(
        data => {
          this.role.id = data['data'].id;
          this.message.success('Role ' + data['data'].name +' con éxito');
          this.btnLoading = false;
          this.router.navigateByUrl("/roles/"+this.role.id)
        }, err => {
          console.log(err);
        }
      )
  }

  getRole(){
    this.roleService.getRole(this.id)
      .subscribe(
        data => {
          this.role = data;
          this.setData();
        },
        err => {  
          if(err.statusCode === 404){
            this.router.navigateByUrl("/role/"+this.id, { skipLocationChange: true });
          } 
        }
      )
  }

  /* ---      Transfer element     --- */
  setData(): void {
    const ret: TransferItem[] = [];
    
    if(this.id == 0){
      this.appPermissions.forEach(p => {
        ret.push({
          key: p.id,
          title: p.name,
          description: p.codename,
          direction: 'left'
        });
      });
    } else {
      this.appPermissions.forEach(p => {
        ret.push({
          key: p.id,
          title: p.name,
          description: p.codename,
          direction: (this.role.permissions.find(x => x === p.id))? 'right' : 'left',
          disabled: (this.id>=1 && this.id<=5)? true : false
        });
      });
    }
    
    this.list = ret;
  }

  transformSelectedItems(): void{
    this.role.permissions = Array<number>();
    let assignedPermissions = this.list.filter(x => x.direction === 'right');

    assignedPermissions.forEach(p => {
      this.role.permissions.push(p.key);
    });
  }

  reload(): void {
    this.setData();
  }

  filterOption(inputValue: string, item: any): boolean {
    return (item.description.toLowerCase()).indexOf(inputValue.toLowerCase()) > -1;
  }
}
