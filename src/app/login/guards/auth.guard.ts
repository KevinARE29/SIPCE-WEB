/*  
  Path: app/login/guards/auth.guard.ts
  Objective: Control access to routes
  Author: Esme López
*/

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../shared/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

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

  canLoad(route: Route){
    return true;
  }

  checkLogin(url: string, next: ActivatedRouteSnapshot): boolean {
    let res = false;
    let token = this.authService.getToken();

    if (!token) {
         
      if(url !== '/login' && url != '/restablecer-contrasena' && url === '/contrasena/cambiar' ){
        this.router.navigate(['login']);
      }
      else{
        res = true;
      } 
    } else {
      let content = this.authService.jwtDecoder(token);
      if (url === '/contrasena/cambiar') {
        res = true;
      }
      
     if (url !== '/login' && url !== '/restablecer-contrasena') {
        if(content){
          let permissions = content.permissions;
          let permission = permissions.indexOf(next.data['permission']);
        
          if(permission == -1 ) {
            this.router.navigate(['login/error403']);
          } else{
            res = true;
          }
        }       
      } else {
        this.router.navigate(['welcome']);
      }

     
    }
    
    return res;
  }
}
