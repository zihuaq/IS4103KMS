import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { AuthenticationService} from './../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  isLoading = false;
  loginError: boolean = false;
  errorMessage: string;

  constructor(
    private route: Router,
    private userService: UserService,
    private http: HttpClient,
    public sessionService: SessionService) { }

  ngOnInit(): void {
  }

 
  userSelector() {
     this.route.navigate(['/userselector']);
   }

   forgetPassword() {
    this.route.navigate(['/forgetpassword']);
  }

  login(loginForm: NgForm) {
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
          user.password = '';

          if (user != null) {
            this.sessionService.setIsLogin(true);
            this.sessionService.setCurrentUser(user);
            this.userService.user.next(user);
            this.userService.loggedIn = true;
            this.loginError = false;
            this.isLoading = false;
            this.route.navigate(['/profile/' + user.userId]);
            //this.route.navigate(['dashboard/' + user.userId]);
            //console.log("success");
          } else {
            this.isLoading = false;
            this.errorMessage = 'User does not exist, please try again';
          }
        },
        (error) => {
          this.isLoading = false;
          this.loginError = true;
          this.errorMessage = "Email does not exist or Password is incorrect.";
          console.log('********** UserLoginComponent.ts login(): ' + error);
          //this.errorMessage = 'Error: ' + error;
        }
      );
    }
  }
}
