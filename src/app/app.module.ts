/*  
  Path: app/app.module.ts
  Objetive: Define app main container
  Author: Esme López
*/

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// importando rutas de otros componentes
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginModule } from './login/login.module'; // modulo del contexto login
import { AntDesignModule } from './ant-design/ant-design.module';
import { MainNavComponent } from './main-nav/main-nav.component';

@NgModule({
  declarations: [AppComponent, MainNavComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AntDesignModule,
    LoginModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
