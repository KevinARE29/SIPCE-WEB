/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
  Path: app/main-nav/main-nav.component.ts
  Objective: Define main navigation behavior
  Author: Esme López y Veronica Reyes
*/

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';

import MenuJson from '../../assets/menu.json';
import { AuthService } from '../login/shared/auth.service';
import { Permission } from '../shared/permission.model';
import { SocketioService } from '../shared/services/socketio.service';
import { EventService } from '../calendar/shared/event.service';

interface RequestNotifications {
  total: number;
  list: unknown[];
}
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
  token: string;
  avatar: string;
  username: string;
  year: number;
  connectionOn = false;
  requestNotifications: RequestNotifications = {
    list: [],
    total: 0
  };

  constructor(
    private router: Router,
    private socketService: SocketioService,
    private authService: AuthService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

  ngAfterContentChecked(): void {
    this.token = this.getToken();
    let hasPermission = false;

    if (!!this.token && !!!this.username) {
      this.getUsername();
      this.setPermissions();

      // Is the user allowed to manage requests?
      hasPermission = !!this.jwt.permissions.find((x) => x === 25);
    } else if (!!!this.token) {
      this.username = null;
      this.connectionOn = false;

    }

    if (!!this.username && !this.connectionOn && hasPermission) {
      // Initial call.
      this.getRequest();

      // Get socket and suscribe.
      this.socketService.setupSocketConnection(this.username).then((obs) => {
        obs.subscribe(() => {
          this.getRequest();
        })
      });
      this.connectionOn = true;
    }
  }

  logoutClicked(): void {
    this.authService.logout().subscribe(
      () => {
        this.authService.cleanLocalStorage();
        this.router.navigate(['/login']);
        this.socketService.closeConnection();
      },
      () => {
        this.authService.cleanLocalStorage();
        this.router.navigate(['/login']);
        this.socketService.closeConnection();
      }
    );
  }

  getUsername(): void {
    this.jwt = this.authService.jwtDecoder(localStorage.getItem('accessToken'));
    this.username = this.jwt.sub;
    this.avatar = this.username.charAt(0).toUpperCase();
  }

  getToken(): string {
    const token = this.authService.getToken();
    return token;
  }

  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    this.menuOptions = MenuJson.menu;

    this.menuOptions.forEach((menu) => {
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

  getRequest(): void {
    this.eventService.getCounselingRequests(null, null, null).subscribe((data) => {
      this.requestNotifications = { total: data['pagination'].totalItems, list: data['data'].splice(0, 5) };
    });
  }
}
