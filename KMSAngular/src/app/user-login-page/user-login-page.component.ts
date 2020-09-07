import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-user-login-page',
  templateUrl: './user-login-page.component.html',
  styleUrls: ['./user-login-page.component.css']
})
export class UserLoginPageComponent implements OnInit {
  email: string;
  password: string

  constructor(private router: Router, private userService: UserService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  newAccountRedirect(){
    this.router.navigate(['/signup']);
  }

  onLogin(loginForm: NgForm){
    console.log(loginForm)
    if(loginForm.valid){
      this.email = loginForm.value.email
      this.password = loginForm.value.password
      // console.log(this.email)
      // console.log(this.password)
      
      this.userService.login(this.email, this.password).subscribe(()=>{

      })
    }
  }

}
