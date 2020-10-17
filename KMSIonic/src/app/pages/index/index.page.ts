import { PostComment } from './../../classes/post-comment';
import { PostService } from './../../services/post.service';
import { UserService } from './../../services/user.service';
import { User } from './../../classes/user';
import { AuthenticationService } from './../../services/authentication.service';
import { Post } from './../../classes/post';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  ActionSheetController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { PostCommentModalPage } from '../post-comment-modal/post-comment-modal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss']
})
export class IndexPage implements OnInit {
  loggedInUser: User;
  newsfeedPosts: Post[];
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private postService: PostService,
    private actionSheetController: ActionSheetController,
    private app: ApplicationRef,
    private toastController: ToastController,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authenticationService.getCurrentUser().then((user: any) => {
      let loggedInUserId = user.userId;
      forkJoin([
        this.userService.getUser(loggedInUserId.toString()),
        this.postService.getPostForUserNewsfeed(loggedInUserId)
      ]).subscribe((result) => {
        this.loggedInUser = result[0];
        this.newsfeedPosts = result[1];
        this.app.tick();
      });
    });
  }

  async postActionSheet(postId: number) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            console.log('Delete chosen');
            this.deletePost(postId);
          }
        },
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            console.log('Edit chosen');
            this.router.navigate(['/create-post/user/edit/' + postId]);
          }
        }
      ]
    });

    actionSheet.onDidDismiss().then(() => {
      console.log('Dismissed');
    });

    await actionSheet.present();
  }

  deletePost(postId: number) {
    this.postService.deletePostById(postId).subscribe(
      async () => {
        const toast = await this.toastController.create({
          message: 'Post deleted!',
          duration: 2000
        });
        toast.present();
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
      },
      async (err) => {
        const toast = await this.toastController.create({
          message: err,
          duration: 2000
        });
        toast.present();
      }
    );
  }

  userHaveLikedPost(postId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    let index = post.likers.findIndex(
      (user) => user.userId == this.loggedInUser.userId
    );
    return index > -1;
  }

  like(postId: number) {
    console.log('like', postId);
    this.postService
      .likePost(this.loggedInUser.userId, postId)
      .subscribe(() => {
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
      });
  }

  removeLikeForPost(postId: number) {
    this.postService
      .removeLikeForPost(this.loggedInUser.userId, postId)
      .subscribe(() => {
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
      });
  }

  share(postId: number) {
    console.log('share', postId);
  }

  async showPostCommentModal(postId: number) {
    const modal = await this.modalController.create({
      component: PostCommentModalPage,
      swipeToClose: true,
      showBackdrop: true,
      cssClass: 'post-comment-modal',
      componentProps: {
        postId,
        loggedInUser: this.loggedInUser
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.ionViewWillEnter();
    });
  }
}
