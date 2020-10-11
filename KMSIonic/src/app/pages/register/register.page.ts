import { Component, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { UserService } from "../../services/user.service"
import { User } from "../../classes/user"
import { UserType } from "../../enum/user-type.enum"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Router } from "@angular/router"
import { AlertController } from "@ionic/angular"

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  today
  newUser: User
  maxDate = new Date().toISOString().slice(0, 10)
  genders = ["Male", "Female"]
  accountCreated = false
  accountCreationError = false
  errorMessage: string
  successMessage =
    "Account Created successfully an verification email has been sent."
  isLoading = false

  constructor(
    private userService: UserService,
    public http: HttpClient,
    public alertController: AlertController,
    private router: Router
  ) {
    this.today = new Date().toISOString()
    this.newUser = new User()
  }

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

  ngOnInit() {}

  onCreateUser(userRegistrationForm: NgForm) {
    console.log(userRegistrationForm.value)
    if (userRegistrationForm.valid) {
      this.newUser.firstName = userRegistrationForm.value.firstName
      this.newUser.lastName = userRegistrationForm.value.lastName
      this.newUser.email = userRegistrationForm.value.email
      let dobDate = new Date(userRegistrationForm.value.dob)
      this.newUser.dob = dobDate
      this.newUser.gender = userRegistrationForm.value.gender
      this.newUser.password = userRegistrationForm.value.password
      this.newUser.joinedDate = new Date()
      this.newUser.userType = UserType.INDIVIDUAL
      console.log(this.newUser)
      this.isLoading = true

      //this.http.put<any>('/api/user/userRegistration', this.newUser, this.httpOptions)
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

  createInstition() {
    this.router.navigate(["/registerinstitution"])
  }

  directInst() {
    this.router.navigate(["/registerinstitution"])
  }
}
