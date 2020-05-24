/*  
  Path: app/login/guards/auth.guard.ts
  Objetive: Control access to routes
  Author: Esme López
*/

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../shared/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let url: string = state.url;

    return this.checkLogin(url, next);
  }
  
  checkLogin(url: string, next: ActivatedRouteSnapshot): boolean {
    let token = this.authService.getToken();

    if(!token) {
      this.router.navigate(['/login'], {queryParams: { returnUrl: url }});
    } else {
      let content = this.authService.jwtDecoder(token);

      if(url !== '/login'){
        if(content){
          let permissions = content.permissions;
          let permission = permissions.indexOf(next.data['permission']);
          
          if(permission == -1) {
            // TODO: Redirect to 403
            return false;
          }
        }
      } else {
        return false; // Disable login if session is started
      }
      
      return true;
    }

    return false;
  }
}
