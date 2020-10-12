/*  
  Path: app/login/guards/auth.guard.ts
  Objective: Control access to routes
  Author: Esme López
*/

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanLoad,
  Route
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../shared/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url: string = state.url;

    return this.checkLogin(url, next);
  }

  canLoad(route: Route) {
    return true;
  }

  checkLogin(url: string, next: ActivatedRouteSnapshot): boolean {
    let res = false;
    const token = this.authService.getToken();

    if (!token) {
      if (
        url !== '/' &&
        url !== '/login' &&
        url !== '/contrasena/recuperar' &&
        !url.includes('reset-psw') &&
        !url.includes('/counseling/requests?confirmationToken')
      ) {
        this.router.navigate(['login']);
      } else {
        res = true;
      }
    } else {
      const content = this.authService.jwtDecoder(token);
      // TODO: Refactor exceptions
      if (url === '/') {
        this.router.navigate(['inicio']);
      } else if (url === '/contrasena/cambiar' || url === '/inicio') {
        res = true;
      } else if (url !== '/login' && url !== '/contrasena/recuperar' && !url.includes('reset-psw')) {
        if (content) {
          const permissions = content.permissions;
          const permission = permissions.indexOf(next.data['permission']);

          if (permission == -1) {
            this.router.navigate(['login/error403']);
          } else {
            res = true;
          }
        }
      } else {
        this.router.navigate(['inicio']);
      }
    }

    return res;
  }
}
