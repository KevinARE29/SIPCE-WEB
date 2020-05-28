
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
// import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from '../login/shared/auth.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('accessToken'),
        whitelistedDomains: [],
      },
    })
  ],
  providers: [
    JwtHelperService,
    AuthService,
  ]
})
export class InterceptorModule { }
