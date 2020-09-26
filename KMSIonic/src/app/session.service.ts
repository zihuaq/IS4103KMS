import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './classes/user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  getIsLogin(): boolean {
    return localStorage.isLogin == 'true';
  }

  setIsLogin(isLogin: boolean): void {
    localStorage.isLogin = isLogin;
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.currentUser);
  }

  setCurrentUser(currentUser: User): void {
    localStorage.currentUser = JSON.stringify(currentUser);
    localStorage.userSubject = JSON.stringify(new Subject<User>());
  }

  getUsername(): string {
    return localStorage.username;
  }

  setUsername(username: string) {
    localStorage.username = username;
  }

  getPassword(): string {
    return localStorage.password;
  }

  setPassword(password: string): void {
    localStorage.password = password;
  }
  getUserSubject() {
    return JSON.parse(localStorage.userSubject);
  }
}
