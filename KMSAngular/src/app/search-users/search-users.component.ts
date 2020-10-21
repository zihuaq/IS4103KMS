import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FollowRequest } from '../classes/follow-request';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { AccountPrivacySettingEnum } from '../classes/privacy-settings.enum';
import { Router } from '@angular/router';
import { UserType } from '../classes/user-type.enum';
import { TagService } from '../tag.service';
import { Tag } from '../classes/tag';

declare var $: any;

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css'],
})
export class SearchUsersComponent implements OnInit {
  allUsers: User[];
  filteredUsers: User[];
  searchString: string = "";
  loggedInUserId: number;
  loggedInUserFollowing: User[];
  loggedInUserFollowRequestMade: FollowRequest[];
  user: User;
  query: string;
  skillTags: Tag[];
  sdgTags: Tag[];
  selectedSkillTags: Tag[] = [];
  selectedsdgTags: Tag[] = [];
  selectedUserType: UserType = null;
  userTypes: any = [
    { id: "All", value: "All" },
    { id: UserType.ADMIN, value: "Admin" },
    { id: UserType.INDIVIDUAL, value: "Individual" },
    { id: UserType.INSTITUTE, value: "Institute" }
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private sessionService: SessionService,
    private tagService: TagService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let userId = this.activatedRoute.snapshot.params.userid;
    this.query = this.activatedRoute.snapshot.url[1]?.path;
    this.loggedInUserId = this.sessionService.getCurrentUser().userId;
    if (this.query && userId) {
      if (this.query == 'followers') {
        forkJoin([
          this.userService.getFollowers(parseInt(userId)),
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getUser(userId),
          this.tagService.getAllSDGTags(),
          this.tagService.getAllSkillTags()
        ]).subscribe((result) => {
          this.allUsers = result[0];
          this.filteredUsers = this.allUsers;
          this.loggedInUserFollowing = result[1];
          this.loggedInUserFollowRequestMade = result[2];
          this.user = result[3];
          this.sdgTags = result[4];
          this.skillTags = result[5];
          this.initialiseSelect2();
          if (
            this.loggedInUserId != userId &&
            this.user.accountPrivacySetting ==
            AccountPrivacySettingEnum.PRIVATE &&
            !this.loggedInUserFollowing
              .map((user) => user.userId)
              .includes(this.user.userId)
          ) {
            this.router.navigate(['/index']);
          }
        });
      } else if (this.query == 'following') {
        forkJoin([
          this.userService.getFollowing(parseInt(userId)),
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getUser(userId),
          this.tagService.getAllSDGTags(),
          this.tagService.getAllSkillTags()
        ]).subscribe((result) => {
          this.allUsers = result[0];
          this.filteredUsers = this.allUsers;
          this.loggedInUserFollowing = result[1];
          this.loggedInUserFollowRequestMade = result[2];
          this.user = result[3];
          this.sdgTags = result[4];
          this.skillTags = result[5];
          this.initialiseSelect2();
          if (
            this.loggedInUserId != userId &&
            this.user.accountPrivacySetting ==
            AccountPrivacySettingEnum.PRIVATE &&
            !this.loggedInUserFollowing
              .map((user) => user.userId)
              .includes(this.user.userId)
          ) {
            this.router.navigate(['/index']);
          }
        });
      } else if (this.query == 'affiliated') {
        forkJoin([
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getAffiliatedUsers(parseInt(userId)),
          this.userService.getUser(userId),
          this.tagService.getAllSDGTags(),
          this.tagService.getAllSkillTags()
        ]).subscribe((result) => {
          this.loggedInUserFollowing = result[0];
          this.loggedInUserFollowRequestMade = result[1];
          this.allUsers = result[2];
          this.filteredUsers = this.allUsers;
          this.user = result[3];
          this.sdgTags = result[4];
          this.skillTags = result[5];
          this.initialiseSelect2();
          if (
            this.loggedInUserId != userId &&
            this.user.accountPrivacySetting ==
            AccountPrivacySettingEnum.PRIVATE &&
            !this.loggedInUserFollowing
              .map((user) => user.userId)
              .includes(this.user.userId)
          ) {
            this.router.navigate(['/index']);
          }
        });
      }
    } else {
      forkJoin([
        this.userService.getAllUsers(),
        this.userService.getFollowing(this.loggedInUserId),
        this.userService.getFollowRequestMade(this.loggedInUserId),
        this.tagService.getAllSDGTags(),
        this.tagService.getAllSkillTags()
      ]).subscribe((result) => {
        this.allUsers = result[0];
        this.filteredUsers = this.allUsers;
        this.loggedInUserFollowing = result[1];
        this.loggedInUserFollowRequestMade = result[2];
        this.sdgTags = result[3];
        this.skillTags = result[4];
        this.initialiseSelect2();
      });
    }
  }

  initialiseSelect2() {
    $('#searchsdgselect2').select2({
      data: this.sdgTags.map((item) => {
        return item.name;
      }),
      allowClear: true,
    });
    $('#searchskillsselect2').select2({
      data: this.skillTags.map((item) => {
        return item.name;
      }),
      allowClear: true,
    });
    $('#searchsdgselect2').on("change", () => {
      this.sdgChanged()
    });
    $('#searchskillsselect2').on("change", () => {
      this.skillsChanged();
    });
  }

  sdgChanged() {
    let selectedTagNames = $('#searchsdgselect2').val();
    this.selectedsdgTags = []
    this.sdgTags.forEach((element) => {
      if (selectedTagNames.includes(element.name)) {
        this.selectedsdgTags.push(element)
      }
    });
    this.updateFilteredUsersAccordingToRefineOptions();
  }

  skillsChanged() {
    let selectedTagNames = $('#searchskillsselect2').val();
    this.selectedSkillTags = []
    this.skillTags.forEach((element) => {
      if (selectedTagNames.includes(element.name)) {
        this.selectedSkillTags.push(element)
      }
    });
    this.updateFilteredUsersAccordingToRefineOptions();
  }

  updateFilteredUsersAccordingToRefineOptions() {
    this.filteredUsers = [];
    if (this.selectedSkillTags.length > 0 || this.selectedsdgTags.length > 0 || this.selectedUserType) {
      this.allUsers.forEach((user) => {
        let numSkillsMatch = 0;
        let numSDGMatch = 0;
        let userTypeMatch = this.selectedUserType == null;
        user.sdgs.forEach((sdg) => {
          if (this.selectedsdgTags.some(tag => tag.tagId == sdg.tagId)) {
            numSDGMatch++;
          }
        });
        user.skills.forEach((skill) => {
          if (this.selectedSkillTags.some(tag => tag.tagId == skill.tagId)) {
            numSkillsMatch++;
          }
        });
        if (this.selectedUserType) {
          if (this.selectedUserType == user.userType) {
            userTypeMatch = true;
          }
        }
        if (userTypeMatch && numSkillsMatch == this.selectedSkillTags.length && numSDGMatch == this.selectedsdgTags.length && !this.filteredUsers.some(filteredUser => filteredUser.userId == user.userId)) {
          if (this.userMatchSearchString(user)) {
            this.filteredUsers.push(user);
          }
        }
      });
    } else {
      this.allUsers.forEach(user => {
        if (this.userMatchSearchString(user)) {
          this.filteredUsers.push(user);
        }
      });
    }
  }

  userMatchSearchString(user: User) {
    if (user.userType == UserType.INDIVIDUAL || user.userType == UserType.ADMIN) {
      if (!user.firstName.toLowerCase().includes(this.searchString.toLowerCase()) &&
        !user.lastName.toLowerCase().includes(this.searchString.toLowerCase())) {
        return false;
      }
    } else if (user.userType == UserType.INSTITUTE) {
      if (!user.firstName.toLowerCase().includes(this.searchString.toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  onSelectedUserTypeChange(event) {
    if (event.target.value == "All") {
      this.selectedUserType = null;
    } else if (event.target.value == this.selectedUserType) {
      this.selectedUserType = null;
    } else {
      this.selectedUserType = event.target.value;
    }
    this.updateFilteredUsersAccordingToRefineOptions();
  }

  handleSearchStringChanged(event) {
    this.searchString = event;
    this.updateFilteredUsersAccordingToRefineOptions();
  }

  follow(userId: number) {
    this.userService
      .followUser(userId.toString(), this.loggedInUserId.toString())
      .subscribe((followRequest: FollowRequest) => {
        if (followRequest) {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Sent Follow Request',
            autohide: true,
            delay: 2500,
            body: 'Follow Request sent successfully',
          });
        }
        this.updateLoginUserAndUser(userId);
      });
  }

  unfollow(userId: number) {
    this.userService
      .unfollowUser(userId.toString(), this.loggedInUserId.toString())
      .subscribe(() => {
        this.updateLoginUserAndUser(userId);
      });
  }

  checkLoginUserHasFollowed(userId: number) {
    return this.loggedInUserFollowing
      .map((user) => user.userId)
      .includes(userId);
  }

  checkLoginUserHaveSentFollowReq(userId: number) {
    return this.loggedInUserFollowRequestMade
      .map((f) => f.to.userId)
      .includes(userId);
  }

  private updateLoginUserAndUser(userId: number) {
    forkJoin([
      this.userService.getFollowers(userId),
      this.userService.getFollowing(userId),
      this.userService.getFollowers(this.loggedInUserId),
      this.userService.getFollowing(this.loggedInUserId),
      this.userService.getFollowRequestMade(this.loggedInUserId),
    ]).subscribe((result) => {
      this.loggedInUserFollowing = result[3];
      this.loggedInUserFollowRequestMade = result[4];
      let userUpdated = false;
      let loggedInUserUpdated = false;
      for (var user of this.filteredUsers) {
        if (user.userId == userId) {
          user.followers = result[0];
          user.following = result[1];
          userUpdated = true;
        }
        if (user.userId == this.loggedInUserId) {
          user.followers = result[2];
          user.following = result[3];
          loggedInUserUpdated = true;
        }
        if (userUpdated && loggedInUserUpdated) {
          return;
        }
      }
    });
  }
}
