import { Component, OnInit } from "@angular/core"
import { AuthenticationService } from "../../services/authentication.service"
import { Router } from "@angular/router"
import { UserService } from "../../services/user.service"
import { User } from "../../classes/user"
import { NgForm } from "@angular/forms"

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  email: string
  password: string
  isLoading = false
  loginError: boolean = false
  errorMessage: string

  constructor(
    private route: Router,
    private userService: UserService,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  userSelector() {
    this.route.navigate(["/userselector"])
  }

  forgetPassword() {
    this.route.navigate(["/forgetpassword"])
  }

  login(loginForm: NgForm) {
    console.log(loginForm)
    if (loginForm.valid) {
      this.email = loginForm.value.email
      this.password = loginForm.value.password
      this.isLoading = true

      this.userService.login(this.email, this.password).subscribe(
        (response) => {
          let user: User = response

          if (user != null) {
            this.authenticationService.login(user).then(() => {
              this.loginError = false
              this.isLoading = false
              this.route.navigate(["/profile/" + user.userId])
            })
          } else {
            this.isLoading = false
            this.errorMessage = "User does not exist, please try again"
          }
        },
        (error) => {
          this.isLoading = false
          this.loginError = true
          this.errorMessage = "Email does not exist or Password is incorrect."
          console.log("********** UserLoginComponent.ts login(): " + error)
        }
      )
    }
  }
}
