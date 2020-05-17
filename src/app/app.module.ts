/*  
  Path: app/app.module.ts
  Objetive: Define app main container
  Author: Esme López
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AntDesignModule } from './ant-design/ant-design.module';
import { MainNavComponent } from './main-nav/main-nav.component';

import { SecurityPoliciesModule } from './security-policies/security-policies.module';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AntDesignModule,
    SecurityPoliciesModule   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
