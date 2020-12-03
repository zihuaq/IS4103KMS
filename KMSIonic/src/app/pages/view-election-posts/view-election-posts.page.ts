import { Post } from './../../classes/post';
import { User } from 'src/app/classes/user';
import { TagService } from 'src/app/services/tag.service';
import { PostService } from './../../services/post.service';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from './../../services/authentication.service';
import { ElectionService } from './../../services/election.service';
import { Election } from './../../classes/election';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-election-posts',
  templateUrl: './view-election-posts.page.html',
  styleUrls: ['./view-election-posts.page.scss']
})
export class ViewElectionPostsPage implements OnInit {
  loggedInUser: User;
  newsfeedPosts: Post[];
  filteredPosts: Post[];
  activeElections: Election;
  hasActiveElection: boolean;
  constructor(
    private electionService: ElectionService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authenticationService.getCurrentUser().then((user) => {
      this.electionService.getHasActiveElection().subscribe((result) => {
        this.hasActiveElection = result;
        if (this.hasActiveElection) {
          this.electionService.getActiveElection().subscribe((result) => {
            this.activeElections = result;
            forkJoin([
              this.userService.getUser(user.userId.toString()),
              this.postService.getPostForElection(this.activeElections.id)
            ]).subscribe((result) => {
              this.loggedInUser = result[0];
              this.newsfeedPosts = result[1];
              this.filteredPosts = this.newsfeedPosts;
            });
          });
        }
      });
    });
  }
}
