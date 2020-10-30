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
import { SharePostModalPage } from '../share-post-modal/share-post-modal.page';
import { ReportPostModalPage } from '../report-post-modal/report-post-modal.page';

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
        console.log(result[1]);
        this.loggedInUser = result[0];
        this.newsfeedPosts = result[1];
        this.app.tick();
      });
    });
  }
}
