import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TransferItem } from 'ng-zorro-antd/transfer';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../../login/shared/auth.service';
import { PermissionService } from './../../shared/permission.service';
import { Permission } from '../../../shared/permission.model';
import { AppPermission } from '../../shared/app-permission.model';
import { RoleService } from '../../shared/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  id: number;
  permissions: Array<Permission> = [];
  appPermissions: Array<AppPermission> = [];
  value: string;
  list: TransferItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private message: NzMessageService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.setData();
    this.setPermissions();
    this.gateway();
    this.getAppPermissions();
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

        if(this.id === 0){
          console.log("CREATE")
        } else if(this.id >= 1 && this.id <= 5){
          console.log("VIEW ONLY")
        } else{
          console.log("EDIT")
        }
      } else {
        this.router.navigateByUrl("/role/{{param}}", { skipLocationChange: true });
      }
    });
  }

  /* --- Create --- */
  getAppPermissions(){
    this.permissionService.getPermissions()
      .subscribe(
        data => {
          console.log("Permissions");
          this.appPermissions = data['data'];
          console.log(this.appPermissions)
          this.setData();
        },
        err => {  
          console.log(err);   
        }
      )
  }


  /* ---      Transfer element     --- */
  setData(): void {
    const ret: TransferItem[] = [];
    
    if(this.id == 0){
      this.appPermissions.forEach( p => {
        ret.push({
          key: p.id,
          title: p.name,
          description: p.codename,
          direction: 'left'
        });
      });
    }
    
    this.list = ret;
  }


  reload(direction: string): void {
    this.setData();
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret: {}): void {
    console.log('nzChange', ret);
  }

  filterOption(inputValue: string, item: any): boolean {
    return (item.description.toLowerCase()).indexOf(inputValue.toLowerCase()) > -1;
  }
}
