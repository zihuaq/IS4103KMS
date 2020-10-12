import { User } from './../../classes/user';
import { AuthenticationService } from './../../services/authentication.service';
import { Post } from './../../classes/post';
import { PostService } from './../../services/post.service';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';

declare var Camera: any;
declare var navigator: any;

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss']
})
export class CreatePostPage implements OnInit {
  uploadedPicture: string | ArrayBuffer;
  postContent: string;
  loggedInUser: User;
  canPost = false;
  slideOpts = {
    initialSlide: 0,
    direction: 'horizontal',
    spaceBetween: 8,
    loop: false
  };
  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private app: ApplicationRef,
    private postService: PostService,
    private toastController: ToastController,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    let loggedInUserId = this.authenticationService
      .getCurrentUser()
      .then((user: any) => {
        this.loggedInUser = user;
      });
  }

  async createPost() {
    let createdPost = new Post();
    if (
      (this.postContent == null || this.postContent == '') &&
      this.uploadedPicture == null
    ) {
      const toast = await this.toastController.create({
        message: 'Please select a picture or add some text to your post!',
        duration: 2000
      });
      toast.present();
    } else {
      createdPost.postDate = new Date();
      createdPost.text = this.postContent;
      createdPost.picture = this.uploadedPicture;
      createdPost.postOwner = this.loggedInUser;

      this.postService.createPost(createdPost).subscribe(
        async (data: Post) => {
          const toast = await this.toastController.create({
            message: 'Post created!',
            duration: 2000
          });
          toast.present();
          this.router.navigate(['/index']);
        },
        async (err) => {
          const toast = await this.toastController.create({
            message: 'err',
            duration: 2000
          });
          toast.present();
          this.router.navigate(['/index']);
        }
      );
    }
  }

  async choosePictureActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Picture',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera chosen');
            navigator.camera.getPicture(
              (imageUri) => {
                console.log(imageUri);
                this.uploadedPicture = 'data:image/jpeg;base64,' + imageUri;
                this.checkCanPost();
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
                this.uploadedPicture = 'data:image/jpeg;base64,' + imageUri;
                this.checkCanPost();
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
            this.uploadedPicture = null;
            this.checkCanPost();
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

  checkCanPost() {
    if (
      (this.postContent == null || this.postContent == '') &&
      this.uploadedPicture == null
    ) {
      this.canPost = false;
    } else {
      this.canPost = true;
    }
  }
}
