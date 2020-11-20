import { Component, OnInit } from "@angular/core"
import { AuthenticationService } from "../../services/authentication.service"
import { Router } from "@angular/router"
import { UserService } from "../../services/user.service"
import { User } from "../../classes/user"
import { NgForm } from "@angular/forms"
import { ToastController } from '@ionic/angular'
import { FcmService } from '../../services/fcm.service'
import { Platform } from '@ionic/angular'

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
    private router: Router,
    private userService: UserService,
    public authenticationService: AuthenticationService,
    public toastController: ToastController,
    private fcm: FcmService,
    private platform: Platform
  ) {}

  ngOnInit(): void {}

  userSelector() {
    this.router.navigate(["/userselector"])
  }

  forgetPassword() {
    this.router.navigate(["/forgetpassword"])
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
              this.router.navigate([""])
              this.notificationSetup();
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

  private async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  private notificationSetup() {
    this.fcm.getToken();
    console.log(this.fcm.getToken())
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
        }
      });
  }
}
