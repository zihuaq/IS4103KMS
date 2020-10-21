import { Project } from './../../classes/project';
import { Group } from './../../classes/group';
import { ProjectService } from './../../services/project.service';
import { User } from './../../classes/user';
import { AuthenticationService } from './../../services/authentication.service';
import { Post } from './../../classes/post';
import { PostService } from './../../services/post.service';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

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
  postId: number;
  isEditPage: boolean;
  oldPost: Post;
  slideOpts = {
    initialSlide: 0,
    direction: 'horizontal',
    spaceBetween: 8,
    loop: false
  };
  newsfeedType: string;
  projectId: number;
  groupId: number;
  project: Project;
  group: Group;
  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private app: ApplicationRef,
    private postService: PostService,
    private toastController: ToastController,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private location: Location
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.isEditPage = this.activatedRoute.snapshot.url[1]?.path == 'edit';
    this.newsfeedType = this.activatedRoute.snapshot.url[0]?.path;
    if (this.isEditPage) {
      this.postId = this.activatedRoute.snapshot.params.postid;
      this.postService.getPostById(this.postId).subscribe((post: Post) => {
        this.postContent = post.text;
        this.uploadedPicture = post.picture;
        this.oldPost = post;
        this.checkCanPost();
      });
    }
    if (this.newsfeedType == 'project') {
      this.projectId = this.activatedRoute.snapshot.params.projectid;
      this.projectService
        .getProjectById(this.projectId)
        .subscribe((project) => {
          this.project = project;
        });
    }
    if (this.newsfeedType == 'group') {
      this.groupId = this.activatedRoute.snapshot.params.groupid;
      //TODO: get group
    }

    this.authenticationService.getCurrentUser().then((user: any) => {
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
      if (!this.isEditPage) {
        createdPost.postDate = new Date();
        createdPost.text = this.postContent;
        createdPost.picture = this.uploadedPicture;
        createdPost.postOwner = this.loggedInUser;
        createdPost.project = this.project;
        createdPost.group = this.group;

        this.postService.createPost(createdPost).subscribe(
          async (data: Post) => {
            const toast = await this.toastController.create({
              message: 'Post created!',
              duration: 2000
            });
            toast.present();
            this.location.back();
          },
          async (err) => {
            const toast = await this.toastController.create({
              message: err,
              duration: 2000
            });
            toast.present();
            this.location.back();
          }
        );
      } else {
        this.oldPost.text = this.postContent;
        this.oldPost.picture = this.uploadedPicture;
        this.postService.updatePost(this.oldPost).subscribe(
          async () => {
            const toast = await this.toastController.create({
              message: 'Post updated!',
              duration: 2000
            });
            toast.present();
            this.location.back();
          },
          async (err) => {
            const toast = await this.toastController.create({
              message: err,
              duration: 2000
            });
            toast.present();
            this.location.back();
          }
        );
      }
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
