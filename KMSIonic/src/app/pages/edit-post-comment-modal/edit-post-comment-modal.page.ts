import { PostComment } from './../../classes/post-comment';
import { PostService } from './../../services/post.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-post-comment-modal',
  templateUrl: './edit-post-comment-modal.page.html',
  styleUrls: ['./edit-post-comment-modal.page.scss']
})
export class EditPostCommentModalPage implements OnInit {
  @Input() commentId: number;
  @ViewChild('commentInput') commentInput: IonInput;
  comment: PostComment;
  constructor(
    private toastController: ToastController,
    private modalController: ModalController,
    private postService: PostService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.postService.getPostCommentById(this.commentId).subscribe((comment) => {
      this.comment = comment;
    });
  }

  updateComment() {
    this.postService.updateComment(this.comment).subscribe(
      () => {
        this.dismiss();
      },
      async (err) => {
        const toast = await this.toastController.create({
          message: 'Edit failed',
          duration: 1500
        });
        toast.present();
        this.dismiss();
      }
    );
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.commentInput.setFocus();
    }, 150);
  }
}
