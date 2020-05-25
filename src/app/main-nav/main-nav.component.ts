/* 
  Path: app/main-nav/main-nav.component.ts
  Objetive: Define main navigation behavior
  Author: Esme López y Veronica Reyes
*/

import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/shared/auth.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, AfterViewInit, OnChanges {
  isCollapsed = false;
  jwt: any;
  inicial: string;
  avatar: string;
  username: any;
  responseLogIn: any;

  constructor(private router: Router, public authservice: AuthService) { }

  ngOnInit(): void {
    this.getUsername();
  }

  ngAfterViewInit() {

  }

  ngOnChanges() {

  }

  logoutClicked() {
    this.authservice.logout().subscribe(
      (resp) => {
        this.router.navigate(['/login']);
      }, (error) => {
        this.authservice.cleanLocalStorage();
        this.router.navigate(['/login']);
      });

  }

  getUsername() {
    this.jwt = this.authservice.jwtDecoder(localStorage.getItem('accessToken'));
    this.username = this.jwt.sub;
    this.inicial = this.username.charAt(0);
    this.avatar = this.inicial.toUpperCase();
  }



}
