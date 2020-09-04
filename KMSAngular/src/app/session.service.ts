import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() {

    getUsers(): User[]
    {
      try
      {
        return JSON.parse(sessionStorage.users);

      }
      catch
      {
        return null;

      }
    }

    setUsers(users: User[]): void 
    {
      sessionStorage.users = JASON.stringify(users);
    }

   }
}
