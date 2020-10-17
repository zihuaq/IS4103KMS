import { PostService } from './../../services/post.service';
import { User } from 'src/app/classes/user';
import { Post } from './../../classes/post';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonTextarea, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-share-post-modal',
  templateUrl: './share-post-modal.page.html',
  styleUrls: ['./share-post-modal.page.scss']
})
export class SharePostModalPage implements OnInit {
  @ViewChild('sharePostInput') sharePostInput: IonTextarea;
  @Input() sharedPost: Post;
  @Input() loggedInUser: User;
  postContent: string;
  constructor(
    private modalController: ModalController,
    private postService: PostService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.sharePostInput.setFocus();
    }, 150);
  }

  sharePost() {
    let post = new Post();
    post.text = this.postContent;
    post.postDate = new Date();
    this.postService
      .sharePost(this.sharedPost.postId, this.loggedInUser.userId, post)
      .subscribe(async () => {
        const toast = await this.toastController.create({
          message: 'Post shared!',
          duration: 2000
        });
        toast.present();
        this.dismiss();
      });
  }
}
