/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
  Path: app/main-nav/main-nav.component.ts
  Objective: Define main navigation behavior
  Author: Veronica Reyes y Esme Lopez
*/

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';

import MenuJson from '../../assets/menu.json';
import { AuthService } from '../login/shared/auth.service';
import { Permission } from '../shared/permission.model';

import { Appointment } from '../../app/calendar/shared/appointment.model';
import { add } from 'date-fns';
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
  events: Appointment[];
  eventsIds: Array<number> = [];
  menuOptions: any;
  isCollapsed = false;
  jwt: any;
  token: string;
  avatar: string;
  username: string;
  year: number;
  dot = true;

  startDate: Date;
  tomorrowDate: Date;
  endDate: Date;

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
    let hasPermissionForNotifications = false;

    if (!!this.token && !!!this.username) {
      this.getUsername();
      this.setPermissions();

      // Is the user allowed to manage requests?
      hasPermission = this.checkPermission(25);
      // Is the user allowed to view notifications of the upcoming events?
      hasPermissionForNotifications = this.checkPermission(19);
    } else if (!!!this.token) {
      this.username = null;
      this.connectionOn = false;
    }

    if (!!this.username && hasPermissionForNotifications) {
      // Getting tomorrow date and setting the hour to 23:59:59
      this.events = new Array<Appointment>();
      this.tomorrowDate = new Date();
      this.tomorrowDate = add(new Date(), {
        days: 2
      });
      this.tomorrowDate.setHours(0);
      this.tomorrowDate.setMinutes(0);
      this.tomorrowDate.setSeconds(0);
      this.startDate = new Date();
      this.endDate = this.tomorrowDate;
      // Getting events with the specific date range
      this.getEvents(this.startDate, this.endDate);
    }

    if (!!this.username && !this.connectionOn && hasPermission) {
      // Initial call
      this.getRequest();

      // Get socket and suscribe.
      this.socketService.setupSocketConnection(this.username).then((obs) => {
        obs.subscribe(() => {
          this.getRequest();
        });
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

  getEvents(startDate: Date, endDate: Date): void {
    this.events = new Array<Appointment>();
    this.eventService.getEvents(startDate, endDate).subscribe((events) => {
      this.events = events;
    });
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
        if (index !== -1 || permission === 0) counter++;
      });

      if (counter > 0) {
        menu.allowed = true;

        menu.children.forEach((option) => {
          if (menu.permissions.length === 1) option.allowed = true;
          else {
            const index = permissions.indexOf(option.permission);
            option.allowed = index !== -1 || option.permission === 0 ? true : false;
          }
        });
      } else {
        menu.allowed = false;
      }
    });
  }

  markAsView(id: number): void {
    this.eventsIds = new Array<number>();

    const eventRead = this.events.find((p) => p.Id === id);
    if (eventRead.Notification === false) {
      eventRead.Notification = true;
      this.eventsIds.push(eventRead.Id);
      this.eventService.markEventsAsRead(this.eventsIds).subscribe();
    }
    this.router.navigate(['calendario/proximos']);
  }

  markAllAsView(): void {
    this.eventsIds = new Array<number>();
    //Getting all the ids from the events array
    this.events.forEach((appointment) => {
      this.eventsIds.push(appointment.Id);
    });

    this.eventService.markEventsAsRead(this.eventsIds).subscribe(() => {
      this.events.forEach((appointment) => {
        if (appointment.Notification === false) appointment.Notification = true;
      });
    });
  }

  checkPermission(id: number): boolean {
    const isAllowed = !!this.jwt.permissions.find((x) => x === id);
    return isAllowed;
  }

  getRequest(): void {
    this.eventService.getCounselingRequests(null, null, null).subscribe((data) => {
      this.requestNotifications = { total: data['pagination'].totalItems, list: data['data'].splice(0, 5) };
    });
  }
}
