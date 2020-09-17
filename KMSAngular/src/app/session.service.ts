import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './classes/user';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor() {}

  getUsers(): User[] {
    try {
      return JSON.parse(sessionStorage.users);
    } catch {
      return null;
    }
  }

  setUsers(users: User[]): void {
    sessionStorage.users = JSON.stringify(users);
  }

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

  getUserSubject(){
    return JSON.parse(localStorage.userSubject);
  }

}
