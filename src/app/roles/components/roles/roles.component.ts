import { Component, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

import { RoleService } from './../../shared/role.service';

import { Role } from './../../shared/role.model';
import { Pagination } from './../../../shared/pagination.model';

interface DataItem {
  name: string;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: Role[];
  pagination: Pagination;
  loading = false;
  searchValue = '';
  listOfDisplayData: Role[];
  tableSize = 'small'; 
  icon = 'search';
  color = 'primary';
  
  constructor(
    private roleService: RoleService
  ) { }

  ngOnInit(): void { 
    this.pagination = new Pagination();
    this.getRoles();
  }

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
          console.log(err);
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
          console.log(err);
        }
      )
  }

  search(): void {
    this.loading = true;
    
    this.roleService.searchRoles(null, this.searchValue, false)
      .subscribe(
        data => {
          console.log(data);
          this.roles = data['data'];
          this.pagination = data['pagination'];
          this.listOfDisplayData = [...this.roles];
          this.loading = false;
        },
        err => {
          console.log(err);
        }
      )
  }  

  getRole(){

  }

  deleteRole(){
    
  }
}
