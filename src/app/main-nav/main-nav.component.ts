/* 
  Path: app/main-nav/main-nav.component.ts
  Objetive: Define main navigation behavior
  Author: Esme López 
*/

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  isCollapsed = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
