import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { User } from './user' ;
//import { getMaxListeners } from 'cluster';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[];
  baseUrl: string = "/api/User";

  constructor(private sessionService: SessionService, private http: HttpClient) { 
    this.users = this.sessionService.getUsers();

    if(this.users == null)
    {
      this.users = new Array();

      let user: User;

      //user = new User(1, "Yi", "Ren", date, "F", "yiren@gmail.com", password, "", "Singapore", 10, "", date, date);
      //this.users.push(user);

    }
  }

  userRegistration(newUser: User){
    return this.http.post('url',newUser).pipe(

    )
  }

  login(email: String, password: String){
    return this.http.get<any>(this.baseUrl + "/customerLogin?email=" + email + "&password=" + password).pipe(

    )
  }

}
