import { ApplicationRef, Component, NgZone, OnInit } from "@angular/core"
import { NgForm } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { User } from "src/app/classes/user"
import { AccountPrivacySettingEnum } from "src/app/enum/account-privacy-setting.enum"
import { AuthenticationService } from "src/app/services/authentication.service"
import { UserService } from "src/app/services/user.service"
import { ActionSheetController, ToastController } from "@ionic/angular"
import { Location } from "@angular/common"
import { UserType } from "src/app/enum/user-type.enum"

declare var Camera: any
declare var navigator: Navigator

@Component({
  selector: "app-edit-basic-info",
  templateUrl: "./edit-basic-info.page.html",
  styleUrls: ["./edit-basic-info.page.scss"]
})
export class EditBasicInfoPage implements OnInit {
  loggedInUser: User
  loggedInUserId: number
  updatedUser: User
  privacySettings = AccountPrivacySettingEnum
  genders = ["Male", "Female"]
  UserType = UserType

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private app: ApplicationRef
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    let profileid = this.activatedRoute.snapshot.params.userid
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId
        this.userService.getUser(profileid).subscribe((data) => {
          this.loggedInUser = data
        })
      } else {
        //error
      }
    })
  }

  async choosePictureActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Choose Profile Picture",
      buttons: [
        {
          text: "Camera",
          icon: "camera",
          handler: () => {
            console.log("Camera chosen")
            navigator.camera.getPicture(
              (imageUri) => {
                console.log(imageUri)
                this.loggedInUser.profilePicture =
                  "data:image/jpeg;base64," + imageUri
                this.app.tick()
              },
              (error) => {
                console.debug("Unable to obtain picture: " + error, "app")
              },
              this.setOptions(Camera.PictureSourceType.CAMERA)
            )
          }
        },
        {
          text: "Gallery",
          icon: "albums",
          handler: () => {
            console.log("Gallery chosen")
            navigator.camera.getPicture(
              (imageUri) => {
                console.log(imageUri)
                this.loggedInUser.profilePicture =
                  "data:image/jpeg;base64," + imageUri
                this.app.tick()
              },
              (error) => {
                console.debug("Unable to obtain picture: " + error, "app")
              },
              this.setOptions(Camera.PictureSourceType.PHOTOLIBRARY)
            )
          }
        },
        {
          text: "Remove Existing",
          icon: "trash",
          handler: () => {
            this.loggedInUser.profilePicture = null
          }
        }
      ]
    })

    actionSheet.onDidDismiss().then(() => {
      console.log("Dismissed")
    })

    await actionSheet.present()
  }

  setOptions(srcType) {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      correctOrientation: true
    }
    return options
  }

  onEditProfile(editForm: NgForm) {
    this.updatedUser = new User()
    if (editForm.valid) {
      console.log(editForm)
      this.updatedUser.userId = this.loggedInUser.userId
      this.updatedUser.firstName = editForm.value.firstName
      this.updatedUser.lastName = editForm.value.lastName
      this.updatedUser.email = editForm.value.email
      this.updatedUser.dob = new Date(editForm.value.dob)
      this.updatedUser.profilePicture = this.loggedInUser.profilePicture
      this.updatedUser.gender = editForm.value.gender
      this.updatedUser.accountPrivacySetting = editForm.value.privacySettings
      this.userService.updateUser(this.updatedUser).subscribe(
        async (responsedata: User) => {
          console.log(responsedata)
          this.updatedUser = {
            ...this.loggedInUser,
            firstName: responsedata.firstName,
            lastName: responsedata.lastName,
            email: responsedata.email,
            gender: responsedata.gender,
            dob: responsedata.dob,
            profilePicture: responsedata.profilePicture,
            sdgs: responsedata.sdgs,
            accountPrivacySetting: responsedata.accountPrivacySetting
          }
          const toast = await this.toastController.create({
            message: "Your settings have been saved.",
            duration: 2000
          })
          toast.present()
          this.router.navigate(["/profile"])
        },
        async (err) => {
          const toast = await this.toastController.create({
            message: err,
            duration: 2000
          })
        }
      )
    }
  }
}
