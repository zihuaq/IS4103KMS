import { Component, OnInit, ApplicationRef } from '@angular/core';

import { NgForm } from '@angular/forms';
import { ActionSheetController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IonicSelectableComponent } from 'ionic-selectable';

declare var Camera: any;
declare var navigator: any;

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.page.html',
  styleUrls: ['./create-new-project.page.scss'],
})
export class CreateNewProjectPage implements OnInit {

  newProject: Project;
  tags: Tag[];
  currentUserId: number;
  countries: String[];

  constructor(public modalCtrl: ModalController,
    public toastController: ToastController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private app: ApplicationRef,
    private projectService: ProjectService,
    private tagService: TagService,
    private authenticationService: AuthenticationService) { 
      this.newProject = new Project();
      this.newProject.description = "";
      this.tags = [];
      this.countries = [
        "Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", 
        "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", 
        "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", 
        "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", 
        "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", 
        "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", 
        "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", 
        "Congo, The Democratic Republic of The", "Cook Islands", "Costa Rica", "Cote D'ivoire", "Croatia", "Cuba", 
        "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", 
        "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", 
        "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", 
        "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", 
        "Guernsey", "Guinea", "Guinea-bissau", "Guyana", "Haiti", "Heard Island and Mcdonald Islands", 
        "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", 
        "Iran, Islamic Republic of", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", 
        "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", 
        "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", 
        "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", 
        "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
        "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", 
        "Moldova, Republic of", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", 
        "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", 
        "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", 
        "Palestinian Territory, Occupied", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", 
        "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Helena", 
        "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and The Grenadines", "Samoa", 
        "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", 
        "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and The South Sandwich Islands", 
        "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", 
        "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", 
        "Timor-leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
        "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", 
        "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", 
        "Virgin Islands, British", "Virgin Islands, U.S.", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"
      ]
    }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );
  }

  ionViewWillEnter() {
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tags = response;
      }
    )
  }

  async create(createProjectForm: NgForm) {
    let tagIds: number[] = [];
    if (this.newProject.sdgs.length > 0) {
      for (let tag of this.newProject.sdgs) {
        tagIds.push(tag.tagId);
      }
    } else {
      const toast = await this.toastController.create({
        message: "Please select at least one SDG tags.",
        duration: 2000
      })
      toast.present();
      return;
    }

    this.newProject.sdgs = [];
    if (createProjectForm.valid) {
      if (!this.newProject.country) {
        const toast = await this.toastController.create({
          message: "Please select a country",
          color: "danger",
          duration: 2000
        });
        toast.present();
      } else {
        this.newProject.dateCreated = new Date();
        if (!this.newProject.monetaryFundingRequired) {
          this.newProject.monetaryFundingRequired = 0.0;
        }
        if (!this.newProject.paypalEmail) {
          this.newProject.paypalEmail = null;
        }
        if (!this.newProject.profilePicture) {
          this.newProject.profilePicture = null;
        }
        this.projectService.createNewProject(this.newProject, this.currentUserId, tagIds).subscribe(
          async response => {
            this.modalCtrl.dismiss({
              'dismissed': true
            });
            this.router.navigate(["project-details/" + response.projectId]);
            const toast = await this.toastController.create({
              message: 'Project created successfully.',
              duration: 2000
            });
            toast.present();
          },
          async error => {
            const toast = await this.toastController.create({
              message: error,
              color: "danger",
              duration: 2000
            });
            toast.present();
          }
        );
      }
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async choosePictureActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Profile Picture',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera chosen');
            navigator.camera.getPicture(
              (imageUri) => {
                console.log(imageUri);
                this.newProject.profilePicture =
                  'data:image/jpeg;base64,' + imageUri;
                this.app.tick();
              },
              (error) => {
                console.debug('Unable to obtain picture: ' + error, 'app');
              },
              this.setOptions(Camera.PictureSourceType.CAMERA)
            );
          }
        },
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            console.log('Gallery chosen');
            navigator.camera.getPicture(
              (imageUri) => {
                console.log(imageUri);
                this.newProject.profilePicture =
                  'data:image/jpeg;base64,' + imageUri;
                this.app.tick();
              },
              (error) => {
                console.debug('Unable to obtain picture: ' + error, 'app');
              },
              this.setOptions(Camera.PictureSourceType.PHOTOLIBRARY)
            );
          }
        },
        {
          text: 'Remove Existing',
          icon: 'trash',
          handler: () => {
            this.newProject.profilePicture = null;
          }
        }
      ]
    });

    actionSheet.onDidDismiss().then(() => {
      console.log('Dismissed');
    });

    await actionSheet.present();
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
    };
    return options;
  }

  async presentPayPalEmailAlert() {
    const alert = await this.alertController.create({
      cssClass: "paypalEmailAlertCss",
      header: 'PayPal Email',
      message: '<b>What is PayPal?</b><br/> It is a digital payments platform that allows you to make secure online transactions and receive payments. <br/><br/><b>Is a PayPal Account required?</b><br/>Yes if your project has monetary funding required. In addition, an account will also be required if you need to get resources later on. <br/><br/><b>Don\'t have a PayPal account? <br/><a href="https://www.paypal.com/sg/webapps/mpp/account-selection" target="_blank"><u>Sign up here</u></a></b>',
      buttons: ['OK']
    });

    await alert.present();
  }

}
