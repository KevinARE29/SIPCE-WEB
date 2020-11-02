/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
  Path: app/main-nav/main-nav.component.ts
  Objective: Define main navigation behavior
  Author: Veronica Reyes
*/

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../login/shared/auth.service';
import { Permission } from '../shared/permission.model';
import MenuJson from '../../assets/menu.json';
import { EventService } from '../../app/calendar/shared/event.service';
import { Appointment } from '../../app/calendar/shared/appointment.model';
import { add } from 'date-fns';

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
  avatar: string;
  username: string;
  year: number;
  dot = true;

  loading = false;
  startDate: Date;

  tomorrowDate: Date;
  endDate: Date;

  constructor(private eventService: EventService, private router: Router, private authService: AuthService) {}

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
    this.getEvents(this.startDate, this.endDate);
    console.log(this.startDate, 'hola este es la fecha de inicioooooooo');
    console.log(this.endDate, 'hola este es la fecha de fiiiiin');
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

  getEvents(startDate: Date, endDate: Date): void {
    this.loading = true;
    this.events = new Array<Appointment>();
    console.log(startDate, endDate, '---fechas antes de ser enviadas--');
    this.eventService.getEvents(startDate, endDate).subscribe((events) => {
      this.events = events;
      console.log(events, 'eventos----------------');
      this.loading = false;
    });
  }

  getUsername(): void {
    this.jwt = this.authService.jwtDecoder(localStorage.getItem('accessToken'));
    this.username = this.jwt.sub;
    this.avatar = this.username.charAt(0).toUpperCase();
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

  checkPermission(id: number): boolean {
    const index = this.permissions.find((p) => p.id === id);
    return index.allow;
  }

  markAsView(id: number): Appointment[] {
    // this.dot = !this.dot;
    console.log(id, 'id');
    const eventRead = this.events.find((p) => p.Id === id);
    for (let i = 0; i > this.events.length; i++) {
      if (this.events[i].Id === eventRead.Id) this.events[i].notification = true;
    }
    console.log(eventRead, 'evento marcado como leido');
    console.log(this.events, 'array de eventos');
    this.router.navigate(['calendario/proximos']);
    return this.events;
  }

  markAllAsView(): void {
    this.eventsIds = new Array<number>();
    this.events.forEach((appointment) => {
      this.eventsIds.push(appointment.Id);
    });

    console.log(this.eventsIds, 'eventsIds');

    this.eventService.markEventsAsRead(this.eventsIds).subscribe(() => {
      this.dot = !this.dot;
    });
  }
}
