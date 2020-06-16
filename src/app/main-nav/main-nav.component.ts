/* 
  Path: app/main-nav/main-nav.component.ts
  Objective: Define main navigation behavior
  Author: Esme López y Veronica Reyes
*/

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../login/shared/auth.service';
import { Permission } from '../shared/permission.model';
import MenuJson from '../../assets/menu.json';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, AfterContentChecked {
  permissions: Array<Permission> = [];
  menuOptions: any;
  isCollapsed = false;
  jwt: any;
  inicial: string;
  avatar: string;
  username: any;
  responseLogIn: any;
  data: any;

  constructor(
    private router: Router, 
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    if(this.getToken()){
      this.getUsername();
      this.setPermissions();
    }
  }

  logoutClicked() {
    this.authService.logout().subscribe(
      (resp) => {
        this.router.navigate(['/login']);
      }, (error) => {
        this.authService.cleanLocalStorage();
        this.router.navigate(['/login']);
      });
  }

  getUsername() {
    this.jwt = this.authService.jwtDecoder(localStorage.getItem('accessToken'));
    this.username = this.jwt.sub;
    this.inicial = this.username.charAt(0);
    this.avatar = this.inicial.toUpperCase();
  }

  getToken(){
    return this.authService.getToken();
  }

  setPermissions(){
    let token = this.authService.getToken();
    let content = this.authService.jwtDecoder(token);

    let permissions = content.permissions;

    this.menuOptions = MenuJson.menu;

    this.menuOptions.forEach(menu => {
      let index = permissions.indexOf(menu.permission);
      menu.allow = (index == -1)? false : true;
    });
  }
}
