import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SessionService } from "./session.service"
import { UserService } from "./user.service"

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private sessionService: SessionService, private userService: UserService){}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
    return (this.sessionService.getIsLogin())
  }
}
