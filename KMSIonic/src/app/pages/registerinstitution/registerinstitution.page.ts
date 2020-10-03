import { Component, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { UserService } from "../../services/user.service"
import { User } from "../../classes/user"
import { UserType } from "../../enum/user-type.enum"
import { Router } from "@angular/router"
import { AlertController } from "@ionic/angular"

@Component({
  selector: "app-registerinstitution",
  templateUrl: "./registerinstitution.page.html",
  styleUrls: ["./registerinstitution.page.scss"]
})
export class RegisterinstitutionPage implements OnInit {
  newUser: User
  maxDate = new Date().toISOString().slice(0, 10)
  genders = ["male", "female"]
  accountCreated = false
  accountCreationError = false
  errorMessage: string
  successMessage =
    "Account Created successfully an verification email has been sent."
  isLoading = false

  constructor(
    private userService: UserService,
    public alertController: AlertController,
    private router: Router
  ) {
    this.newUser = new User()
  }

  ngOnInit() {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Action Required",
      message: "Please check your email for verification link",
      buttons: ["OK"]
    })

    await alert.present()
    let result = await alert.onDidDismiss()
    console.log(result)
    this.router.navigate(["/login"])
  }

  onCreateUser(userRegistrationForm: NgForm) {
    console.log(userRegistrationForm)
    if (userRegistrationForm.valid) {
      this.newUser.firstName = userRegistrationForm.value.istitutionName
      this.newUser.email = userRegistrationForm.value.email
      this.newUser.password = userRegistrationForm.value.password
      this.newUser.joinedDate = new Date()
      this.newUser.userType = UserType.INSTITUTE
      console.log(this.newUser)
      this.isLoading = true
      this.userService.userRegistration(this.newUser).subscribe(
        (responsedata) => {
          console.log(responsedata)
          this.isLoading = false
          this.accountCreated = true
          this.accountCreationError = false
        },
        (error) => {
          this.isLoading = false
          this.accountCreated = false
          this.accountCreationError = true
          this.errorMessage = "This email is already in use."
        }
      )
    }
  }
  directInd() {
    this.router.navigate(["/register"])
  }
}
