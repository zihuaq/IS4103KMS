import { SharePostModalPage } from './../../pages/share-post-modal/share-post-modal.page';
import { PostCommentModalPage } from './../../pages/post-comment-modal/post-comment-modal.page';
import { Post } from './../../classes/post';
import { User } from './../../classes/user';
import {
  ApplicationRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  ToastController,
  ModalController
} from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { ReportPostModalPage } from '../../pages/report-post-modal/report-post-modal.page';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss']
})
export class NewsfeedComponent implements OnInit {
  @Input() loggedInUser: User;
  @Input() newsfeedPosts: Post[];
  @Input() newsfeedType: string;
  @Input() isMember: boolean;
  @Input() projectId: number;
  @Input() groupId: number;
  @Output() init = new EventEmitter();

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

  ngOnInit() {
    console.log('init');
  }

  async postActionSheet(post: Post) {
    let actionSheet;
    if (this.loggedInUser.userId == post.postOwner.userId) {
      actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
              console.log('Delete chosen');
              this.deletePost(post.postId);
            }
          },
          {
            text: 'Edit',
            icon: 'create',
            handler: () => {
              console.log('Edit chosen');
              this.router.navigate([
                '/create-post/' + this.newsfeedType + '/edit/' + post.postId
              ]);
            }
          }
        ]
      });
    } else {
      actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Report',
            icon: 'alert-circle',
            handler: async () => {
              console.log('Report chosen');
              const modal = await this.modalController.create({
                component: ReportPostModalPage,
                swipeToClose: true,
                showBackdrop: true,
                cssClass: 'report-post-modal',
                componentProps: {
                  post,
                  loggedInUser: this.loggedInUser
                }
              });
              modal.present();
              modal.onDidDismiss().then(() => {
                this.init.emit();
              });
            }
          }
        ]
      });
    }
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
        if (this.newsfeedType == 'user') {
          this.postService
            .getPostForUserNewsfeed(this.loggedInUser.userId)
            .subscribe((result) => {
              this.newsfeedPosts = result;
            });
        }
        if (this.newsfeedType == 'project') {
          this.postService
            .getPostForProjectNewsfeed(this.projectId)
            .subscribe((result) => {
              this.newsfeedPosts = result;
            });
        }
        if (this.newsfeedType == 'group') {
          //TODO: get post for group news feed
        }
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
        if (this.newsfeedType == 'user') {
          this.postService
            .getPostForUserNewsfeed(this.loggedInUser.userId)
            .subscribe((result) => {
              this.newsfeedPosts = result;
            });
        }
        if (this.newsfeedType == 'project') {
          this.postService
            .getPostForProjectNewsfeed(this.projectId)
            .subscribe((result) => {
              this.newsfeedPosts = result;
            });
        }
        if (this.newsfeedType == 'group') {
          //TODO: get post for group news feed
        }
      });
  }

  removeLikeForPost(postId: number) {
    this.postService
      .removeLikeForPost(this.loggedInUser.userId, postId)
      .subscribe(() => {
        if (this.newsfeedType == 'user') {
          this.postService
            .getPostForUserNewsfeed(this.loggedInUser.userId)
            .subscribe((result) => {
              this.newsfeedPosts = result;
            });
        }
        if (this.newsfeedType == 'project') {
          this.postService
            .getPostForProjectNewsfeed(this.projectId)
            .subscribe((result) => {
              this.newsfeedPosts = result;
            });
        }
        if (this.newsfeedType == 'group') {
          //TODO: get post for group news feed
        }
      });
  }

  async share(post: Post) {
    console.log('share', post.postId);
    const modal = await this.modalController.create({
      component: SharePostModalPage,
      swipeToClose: true,
      showBackdrop: true,
      cssClass: 'share-post-modal',
      componentProps: {
        sharedPost: post,
        loggedInUser: this.loggedInUser
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.init.emit();
    });
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
      this.init.emit();
    });
  }
}
