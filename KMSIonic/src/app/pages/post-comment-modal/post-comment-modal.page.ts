import { PostService } from './../../services/post.service';
import { PostComment } from './../../classes/post-comment';
import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { User } from './../../classes/user';
import { EditPostCommentModalPage } from '../edit-post-comment-modal/edit-post-comment-modal.page';
import { ReportCommentModalPage } from '../report-comment-modal/report-comment-modal.page';

@Component({
  selector: 'app-post-comment-modal',
  templateUrl: './post-comment-modal.page.html',
  styleUrls: ['./post-comment-modal.page.scss']
})
export class PostCommentModalPage implements OnInit {
  @Input() postId: number;
  @Input() loggedInUser: User;
  commentText: string;
  comments: PostComment[];
  constructor(
    private modalController: ModalController,
    private postService: PostService,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.postService.getCommentsForPost(this.postId).subscribe((result) => {
      this.comments = result;
    });
  }

  addComment() {
    let comment = new PostComment();
    let user = new User();
    user.userId = this.loggedInUser.userId;
    comment.commentOwner = user;
    comment.comment = this.commentText;
    comment.dateTime = new Date();
    this.postService
      .addCommentForPost(this.postId, comment)
      .subscribe((result) => {
        this.comments = result;
        this.commentText = null;
      });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async postCommentActionSheet(comment: PostComment) {
    let actionSheet;
    if (this.loggedInUser.userId == comment.commentOwner.userId) {
      actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Delete',
            icon: 'trash',
            handler: () => {
              console.log('Delete chosen', comment.postCommentId);
              this.postService.deleteComment(comment.postCommentId).subscribe(
                async () => {
                  const toast = await this.toastController.create({
                    message: 'Comment deleted!',
                    duration: 2000
                  });
                  toast.present();
                  this.postService
                    .getCommentsForPost(this.postId)
                    .subscribe((result) => {
                      this.comments = result;
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
          },
          {
            text: 'Edit',
            icon: 'create',
            handler: async () => {
              const modal = await this.modalController.create({
                component: EditPostCommentModalPage,
                swipeToClose: true,
                showBackdrop: true,
                cssClass: 'edit-post-comment-modal',
                componentProps: {
                  commentId: comment.postCommentId
                }
              });
              modal.present();
              modal.onDidDismiss().then(() => {
                this.ionViewWillEnter();
              });
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
                component: ReportCommentModalPage,
                swipeToClose: true,
                showBackdrop: true,
                cssClass: 'report-post-modal',
                componentProps: {
                  comment,
                  loggedInUser: this.loggedInUser
                }
              });
              modal.present();
              modal.onDidDismiss().then(() => {
                this.ionViewWillEnter();
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

  likeComment(commentId: number) {
    this.postService
      .likeComment(this.loggedInUser.userId, commentId)
      .subscribe(() => {
        this.postService.getCommentsForPost(this.postId).subscribe((result) => {
          this.comments = result;
        });
      });
  }

  removeLikeForComment(commentId: number) {
    this.postService
      .removeLikeForComment(this.loggedInUser.userId, commentId)
      .subscribe(() => {
        this.postService.getCommentsForPost(this.postId).subscribe((result) => {
          this.comments = result;
        });
      });
  }

  userHaveLikedComment(commentId: number) {
    let comment = this.comments.find(
      (comment) => comment.postCommentId == commentId
    );
    let index = comment.likers.findIndex(
      (user) => user.userId == this.loggedInUser.userId
    );
    return index > -1;
  }
}
