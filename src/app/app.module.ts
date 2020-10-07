/*  
  Path: app/app.module.ts
  Objective: Define app main container
  Author: Esme López y Veronica Reyes
*/

import { BrowserModule } from '@angular/platform-browser';
import {
  ScheduleModule,
  AgendaService,
  DayService,
  WeekService,
  WorkWeekService,
  MonthService
} from '@syncfusion/ej2-angular-schedule';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { LoginModule } from './login/login.module';

import { AntDesignModule } from './ant-design/ant-design.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { InterceptorModule } from './interceptors/interceptor.module';

import { AuthInterceptor } from './interceptors/auth-interceptor';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';

@NgModule({
  declarations: [AppComponent, MainNavComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    AgendaService,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService
  ],
  imports: [
    ScheduleModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AntDesignModule,
    LoginModule,
    HttpClientModule,
    InterceptorModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
