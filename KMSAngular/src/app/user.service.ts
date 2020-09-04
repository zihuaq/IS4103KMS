import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { User } from './user' ;
import { getMaxListeners } from 'cluster';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[];

  constructor(private sessionService: SessionService) { 
    this.users = this.sessionService.getUser();

    if(this.users == null)
    {
      this.users = new Array();

      let user: User;

      //user = new User(1, "Yi", "Ren", date, "F", "yiren@gmail.com", password, "", "Singapore", 10, "", date, date);
      //this.users.push(user);

    }


  }
}
