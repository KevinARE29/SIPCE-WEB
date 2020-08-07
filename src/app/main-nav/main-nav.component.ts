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
  year: number;
  checked = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

  ngAfterContentChecked(): void {
    if (this.getToken()) {
      this.getUsername();
      this.setPermissions();
    }
  }

  logoutClicked(): void {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      () => {
        this.authService.cleanLocalStorage();
        this.router.navigate(['/login']);
      }
    );
  }

  getUsername(): void {
    this.jwt = this.authService.jwtDecoder(localStorage.getItem('accessToken'));
    this.username = this.jwt.sub;
    this.inicial = this.username.charAt(0);
    this.avatar = this.inicial.toUpperCase();
  }

  getToken(): string {
    return this.authService.getToken();
  }

  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    this.menuOptions = MenuJson.menu;

    this.menuOptions.forEach((menu) => {
      // TODO: Evaluate if at least one of the permissions is allowed
      let counter = 0;
      menu.permissions.forEach((permission) => {
        const index = permissions.indexOf(permission);
        if (index !== -1) counter++;
      });

      if (counter > 0) {
        menu.allowed = true;

        menu.children.forEach((option) => {
          if (menu.permissions.length === 1) option.allowed = true;
          else {
            const index = permissions.indexOf(option.permission);
            option.allowed = index !== -1 ? true : false;
          }
        });
      } else {
        menu.allowed = false;
      }
    });
  }
}
