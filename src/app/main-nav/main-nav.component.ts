/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
  Path: app/main-nav/main-nav.component.ts
  Objective: Define main navigation behavior
  Author: Veronica Reyes
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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

  loading = false;
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
    private notification: NzNotificationService,
    private eventService: EventService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.events = new Array<Appointment>();

    this.tomorrowDate = new Date();
    this.tomorrowDate = add(new Date(), {
      days: 1
    });
    this.tomorrowDate.setHours(23);
    this.tomorrowDate.setMinutes(59);
    this.tomorrowDate.setSeconds(59);
    this.startDate = new Date();
    this.endDate = this.tomorrowDate;

    console.log(this.startDate, 'hola este es la fecha de inicioooooooo');
    console.log(this.endDate, 'hola este es la fecha de fiiiiin');
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
      this.getEvents(this.startDate, this.endDate);
    }

    if (!!this.username && !this.connectionOn && hasPermission) {
      // Initial call.
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
    console.log(startDate, endDate, '---fechas antes de ser enviadas--');
    this.eventService.getEvents(startDate, endDate).subscribe((events) => {
      this.events = events;
      console.log(events, 'eventos----------------');
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

  markAsView(id: number): void {
    // this.dot = !this.dot;
    this.eventsIds = new Array<number>();

    console.log(id, 'id');
    const eventRead = this.events.find((p) => p.Id === id);
    if (eventRead.notification === false) {
      eventRead.notification = true;
      console.log(eventRead, 'evento marcado como leido');
      console.log(this.events, 'array de eventos');
      this.eventsIds.push(eventRead.Id);
      this.eventService.markEventsAsRead(this.eventsIds).subscribe(() => {
        this.message.success('Evento marcado como leído exitosamente');
      });
    }
    this.router.navigate(['calendario/proximos']);
  }

  markAllAsView(): void {
    this.eventsIds = new Array<number>();
    //Getting all the ids from the events array
    this.events.forEach((appointment) => {
      this.eventsIds.push(appointment.Id);
    });

    console.log(this.eventsIds, 'eventsIds');

    this.eventService.markEventsAsRead(this.eventsIds).subscribe(() => {
      this.events.forEach((appointment) => {
        if (appointment.notification === false) appointment.notification = true;
      });
      this.message.success('Eventos marcados como leídos exitosamente');
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
