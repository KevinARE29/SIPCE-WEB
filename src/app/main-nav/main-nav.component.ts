/* 
  Path: app/main-nav/main-nav.component.ts
  Objetive: Define main navigation behavior
  Author: Esme López y Veronica Reyes
*/

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../login/shared/auth.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, AfterContentChecked {
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

}
