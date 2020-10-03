import { ApplicationRef, Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { User } from "src/app/classes/user"
import { UserService } from "src/app/services/user.service"
import { AuthenticationService } from "./../../services/authentication.service"
import { forkJoin } from "rxjs"
import { ModalController } from "@ionic/angular"
import { ReportProfileComponent } from "./report-profile/report-profile.component"
import { MaterialResourceAvailableService } from "./../../services/material-resource-available.service"
import { NgForm } from "@angular/forms"

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  profile: User
  loggedInUser: User
  loggedInUserId: number
  status = ["Active", "Deactive"]
  passwordUpdated = false
  passwordError = false
  passwordErrorMessage: string
  passwordSuccessMessage = "Password successfully changed"

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private mraService: MaterialResourceAvailableService,
    private modalController: ModalController,
    private app: ApplicationRef,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    let profileid = this.activatedRoute.snapshot.params.userid
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId
        forkJoin([
          this.userService.getUser(profileid),
          this.userService.getSkillsForProfile(profileid),
          this.userService.getSDGsForProfile(profileid),
          this.mraService.getMaterialResourceAvailable(profileid)
        ]).subscribe((result) => {
          this.profile = result[0]
          this.loggedInUser = result[0]
          this.profile.skills = result[1]
          this.profile.sdgs = result[2]
          this.profile.mras = result[3]
          this.app.tick()
        })
      } else {
        forkJoin([
          this.userService.getUser(this.loggedInUserId.toString()),
          this.userService.getUser(profileid),
          this.userService.getSkillsForProfile(profileid),
          this.userService.getSDGsForProfile(profileid),
          this.mraService.getMaterialResourceAvailable(profileid)
        ]).subscribe((result) => {
          this.loggedInUser = result[0]
          this.profile = result[1]
          this.profile.skills = result[2]
          this.profile.sdgs = result[3]
          this.profile.mras = result[4]
          this.app.tick()
        })
      }
    })
  }

  async presentReportProfileModal() {
    const modal = await this.modalController.create({
      component: ReportProfileComponent,
      componentProps: {
        profileId: this.profile.userId,
        loggedInUserId: this.loggedInUserId
      }
    })
    return await modal.present()
  }

  goToSetting() {
    this.router.navigate(["/user-setting"])
  }

  // changePassword(passwordForm: NgForm) {
  //   if (passwordForm.valid) {
  //     let email = this.loggedInUser.email;
  //     let oldPassword = passwordForm.value.oldPassword;
  //     let newPassword = passwordForm.value.newPassword;
  //     let confirmNewPassword = passwordForm.value.confirmNewPassword;
  //     if (confirmNewPassword == newPassword) {
  //       this.userService
  //         .updateCustomerPassword(email, oldPassword, newPassword)
  //         .subscribe(
  //           (responsedata) => {
  //             this.passwordUpdated = true;
  //             this.passwordError = false;
  //             setTimeout(() => {
  //               $('#changePasswordModalCloseBtn').click();
  //             }, 2000);
  //           },
  //           (error) => {
  //             this.passwordError = true;
  //             this.passwordUpdated = false;
  //             this.passwordErrorMessage = 'Incorrect passward';
  //           }
  //         );
  //     } else {
  //       this.passwordError = true;
  //       this.passwordUpdated = false;
  //       this.passwordErrorMessage = 'passwords do not match';
  //     }
  //     console.log(passwordForm);
  //   }
  // }
}
