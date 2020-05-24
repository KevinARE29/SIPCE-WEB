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

import { LoginModule } from './login/login.module'; 
import { AntDesignModule } from './ant-design/ant-design.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { WelcomeModule } from './pages/welcome/welcome.module';

@NgModule({
  declarations: [AppComponent, MainNavComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AntDesignModule,
    LoginModule,
    WelcomeModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
