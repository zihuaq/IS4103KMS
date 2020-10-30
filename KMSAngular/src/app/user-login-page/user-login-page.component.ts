import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { User } from '../classes/user';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-user-login-page',
  templateUrl: './user-login-page.component.html',
  styleUrls: ['./user-login-page.component.css'],
})
export class UserLoginPageComponent implements OnInit {
  email: string;
  password: string;
  isLoading = false;
  loginError: boolean = false;
  errorMessage: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private http: HttpClient,
    public sessionService: SessionService
  ) {}

  ngOnInit(): void {}

  newAccountRedirect() {
    this.router.navigate(['/signup']);
  }

  onLogin(loginForm: NgForm) {
    console.log(loginForm);
    if (loginForm.valid) {
      this.email = loginForm.value.email;
      this.password = loginForm.value.password;
      // console.log(this.email)
      // console.log(this.password)
      this.isLoading = true;

      this.userService.login(this.email, this.password).subscribe(
        (response) => {
          let user: User = response;

          if (user != null) {
            this.sessionService.setIsLogin(true);
            if(user.userType.toString() == "ADMIN"){
              this.sessionService.setIsAdmin(true);
            }
            this.sessionService.setCurrentUser(user);
            this.userService.user.next(user);
            this.userService.loggedIn = true;
            this.loginError = false;
            this.isLoading = false;
            this.router.navigate(['profile/' + user.userId]);
          } else {
            this.loginError = true;
            this.isLoading = false;
            this.errorMessage = 'User does not exist, please try again';
          }
        },
        (error) => {
          this.isLoading = false;
          this.loginError = true;

          this.errorMessage = error;
          console.log('********** UserLoginComponent.ts UserLogin(): ' + error);

        }
      );
    }
  }
}
