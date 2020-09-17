import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from "./user.service";

@Injectable({providedIn: 'root'})
export class RouteGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean{
    return this.userService.isAuthenticated().then(
        (authenticated: boolean) => {
          if(authenticated){
            return true;
          }
          else {
            this.router.navigate(['/login']);
          }
        }
      );
  }
}


