import { PostService } from './../../services/post.service';
import { PostComment } from './../../classes/post-comment';
import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { User } from './../../classes/user';
import { EditPostCommentModalPage } from '../edit-post-comment-modal/edit-post-comment-modal.page';

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
    private actionSheetController: ActionSheetController
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

  async postCommentActionSheet(commentId: number) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            console.log('Delete chosen');
            this.postService.deleteComment(commentId);
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
              cssClass: 'post-comment-modal',
              componentProps: {
                commentId
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

    actionSheet.onDidDismiss().then(() => {
      console.log('Dismissed');
    });

    await actionSheet.present();
  }
}
