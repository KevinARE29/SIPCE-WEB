/* 
  Path: app/main-nav/main-nav.component.ts
  Objetive: Define main navigation behavior
  Author: Esme López 
*/

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/shared/auth.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, AfterViewInit {
  isCollapsed = false;
  jwt: any;
  inicial: string;
  avatar: string;
  username: any;
  responseLogIn: any;

  constructor(private router: Router, public authservice: AuthService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getUsername();
  }

  ngOnChange() {

  }

  logoutClicked() {
    console.log('este es el token');
    console.log(this.authservice.getToken());
    console.log(typeof (this.authservice.getToken()));
    this.authservice.logout().subscribe(
      (resp) => {
        console.log('esto responde el logout', resp);
        this.router.navigate(['/login']);
      }, (error) => {
        console.log('esto tiene error');
        console.log(error);
        this.authservice.cleanLocalStorage();
        this.router.navigate(['/login']);
      });

  }

  getUsername() {
    this.jwt = this.authservice.jwtDecoder(localStorage.getItem('accessToken'));
    console.log('este es el username', this.jwt.sub);
    this.username = this.jwt.sub;
    this.inicial = this.username.charAt(0);
    this.avatar = this.inicial.toUpperCase();
  }



}
