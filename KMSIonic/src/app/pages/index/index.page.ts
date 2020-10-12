import { PostService } from './../../services/post.service';
import { UserService } from './../../services/user.service';
import { User } from './../../classes/user';
import { AuthenticationService } from './../../services/authentication.service';
import { Post } from './../../classes/post';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';

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
    private app: ApplicationRef
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
      });
    });
  }

  async postActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            console.log('Delete chosen');
          }
        },
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            console.log('Edit chosen');
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
