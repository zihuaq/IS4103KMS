import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Group } from 'src/app/classes/group';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { GroupService } from 'src/app/group.service';
import { MatchingService } from 'src/app/matching.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';
import { GroupRecommendationBasedOnFollowingRsp } from 'src/app/models/GroupRecommendationBasedOnFollowingRsp';

declare var $: any;

@Component({
  selector: 'app-group-recommendations',
  templateUrl: './group-recommendations.component.html',
  styleUrls: ['./group-recommendations.component.css']
})
export class GroupRecommendationsComponent implements OnInit {

  currentUser: User;
  groupRecoBySDG: Group[];
  groupRecoByFollowing: GroupRecommendationBasedOnFollowingRsp[];
  hasRecommendations: Boolean;
  loggedInUserGroups: Group[];
  fullView: boolean = false;

  constructor(private sessionService: SessionService, private matchingService: MatchingService,
    private groupService: GroupService, private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.sessionService.getCurrentUser();
    this.updateComponent();
  }

  updateComponent() {
    forkJoin([
      this.matchingService.getGroupRecommendationsBasedOnSDG(this.currentUser.userId),
      this.matchingService.getGroupRecommendationsBasedOnFollowing(this.currentUser.userId),
      this.userService.getGroupsJoined(this.currentUser.userId),
    ]).subscribe((result) => {
      this.groupRecoBySDG = result[0];
      this.groupRecoByFollowing = result[1];
      this.loggedInUserGroups = result[2];
      if (this.groupRecoBySDG.length == 0 && this.groupRecoByFollowing.length == 0) {
        this.hasRecommendations = false;
      } else {
        this.hasRecommendations = true;
      }
    })
  }

  joinGroup(group: Group) {
    this.groupService.joinGroup(group.groupId, this.currentUser.userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Welcome to the group',
        })
        this.updateComponent();
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        })
      });
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }

  toggleFullView(){
    this.fullView = !this.fullView;
  }
}
