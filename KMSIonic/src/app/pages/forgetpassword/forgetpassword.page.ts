import { Component, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { UserService } from "../../services/user.service"
import { AlertController } from "@ionic/angular"
import { Router } from "@angular/router"

@Component({
  selector: "app-forgetpassword",
  templateUrl: "./forgetpassword.page.html",
  styleUrls: ["./forgetpassword.page.scss"]
})
export class ForgetpasswordPage implements OnInit {
  requestSent = false
  isLoading = false
  requestSentError = false
  errorMessage: string
  successMessage = "New password sent please check your email"

  constructor(
    private userService: UserService,
    public alertController: AlertController,
    private route: Router
  ) {}

  ngOnInit() {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Action Required",
      message: "New password sent please check your email",
      buttons: ["OK"]
    })

    await alert.present()
    let result = await alert.onDidDismiss()
    console.log(result)
    this.route.navigate(["/login"])
  }

  getNewPassword(forgotPasswordForm: NgForm) {
    console.log(forgotPasswordForm)
    if (forgotPasswordForm.valid) {
      let email: String = forgotPasswordForm.value.email
      this.isLoading = true
      this.userService.resetPassword(email).subscribe(
        (Response) => {
          this.isLoading = false
          this.requestSent = true
          this.requestSentError = false
        },
        (error) => {
          this.isLoading = false
          this.errorMessage =
            "There was an error sending the request, make sure your email address is correct."
          this.requestSentError = true
          this.requestSent = false
        }
      )
    }
  }
}
