import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { NgForm } from '@angular/forms';
import { PostService } from 'src/app/post.service';
import { SharePostToProjectOrGroupsReq } from 'src/app/models/SharePostToProjectOrGroupsReq';
import { Post } from 'src/app/classes/post';

declare var $: any;
declare let require: any;

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  loaded: boolean = false;
  projectId: number;
  projectToView: Project;
  loggedInUser: User
  owner: User;
  dateCreated: string;
  isMember: boolean = false;
  isAdmin: boolean = false;
  profilePicture: string | ArrayBuffer;
  selectedProfilePicture: string | ArrayBuffer;
  selectedProfilePictureName: string;
  noOfMembers: number;
  settingStatus = ['Active', 'Deactive'];
  //currencySymbol: string;
  shareOption: any = [
    { id: "follower", value: "Followers" },
    { id: "project", value: "Project(s)" },
    { id: "group", value: "Group(s)" }
  ];
  selectedShareOption: string;
  shareProjectText: string = "";

  constructor(public projectService: ProjectService,
    private userService: UserService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private postService: PostService) {
    this.projectToView = new Project();
    this.owner = new User();
  }

  ngOnInit(): void {
    this.checkAccessRight();
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.userService.getUser(loggedInUserId.toString()).subscribe(
      (data) => {
        this.loggedInUser = data;
        $('#shareProjectToProjectselect2').select2({
          data: this.loggedInUser.projectsJoined.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
        $('#shareProjectToGroupselect2').select2({
          data: this.loggedInUser.groupsJoined.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });

        this.projectService.getProjectById(this.projectId).subscribe(
          response => {
            this.projectToView = response;
            this.loaded = true;
            this.noOfMembers = this.projectToView.projectMembers.length;
            this.profilePicture = this.projectToView.profilePicture;
            //console.log(this.profilePicture);
            this.owner = this.projectToView.projectOwner;

            for (let admin of this.projectToView.projectAdmins) {
              if (this.sessionService.getCurrentUser().userId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }

            if (!this.isAdmin) {
              for (let member of this.projectToView.projectMembers) {
                if (this.sessionService.getCurrentUser().userId == member.userId) {
                  this.isMember = true;
                }
              }
            }
            this.dateCreated = this.projectToView.dateCreated.toString().substring(0, 10);
            // var getSymbolFromCurrency = require('currency-symbol-map')
            // this.currencySymbol = getSymbolFromCurrency(this.projectToView.currency);
          },
          error => {
            $(document).Toasts('create', {
              class: 'bg-danger',
              title: 'Error',
              autohide: true,
              delay: 2500,
              body: error,
            })
            this.router.navigate(["/error"]);
          }
        )
      });
  }

  joinProject() {
    console.log("******** joinProject()");
    this.projectService.joinProject(this.projectId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Welcome to the project',
        });
        location.reload();
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      });
  }

  leaveProject() {
    this.projectService.removeMember(this.projectId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Goodbye',
        })
        location.reload();
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

  onSelect() {
    this.router.navigate(["/editProject/" + this.projectId]);
  }

  checkAdmin(user: User): boolean {
    for (let member of this.projectToView.projectAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  checkAccessRight() {
    if (!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

  getFiles(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedProfilePicture = e.target.result;
        //console.log(this.selectedProfilePicture);
      };
      this.selectedProfilePictureName = event.target.files[0].name;
      //console.log(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.selectedProfilePicture = undefined;
    }
  }

  removePicture() {
    if (this.profilePicture != undefined) {
      this.profilePicture = undefined;
      this.selectedProfilePicture = undefined;
    }
  }

  saveChanges() {
    this.projectToView.profilePicture = this.selectedProfilePicture;
    this.projectService.updateProject(this.projectToView).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Profile picture updated successfully',
        })
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-warning',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    );
    this.profilePicture = this.selectedProfilePicture;
    this.selectedProfilePicture = undefined;
  }

  cancel() {
    this.profilePicture = this.projectToView.profilePicture;
    this.selectedProfilePicture = undefined;
  }

  get projectType(): typeof ProjectType {
    return ProjectType;
  }

  onEditProjectSetting(disableForm: NgForm) {
    if (disableForm.valid) {
      console.log(disableForm)
    }
    let active: boolean
    if (disableForm.value.status == "Active") {
      this.projectToView.isActive = true
    }
    else {
      this.projectToView.isActive = false;
    }
    this.projectService.updateProject(this.projectToView).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Project Setting updated successfully',
        })
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-warning',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    );

  }

  onSelectedShareOptionChange(event) {
    this.selectedShareOption = event.target.value;
  }

  shareProject() {
    if (this.selectedShareOption == "project") {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.shareProjectText;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedProjectNames = $('#shareProjectToProjectselect2').val();
      let selectedProjectIds = [];
      this.loggedInUser.projectsJoined.forEach((element) => {
        if (selectedProjectNames.includes(element.name)) {
          selectedProjectIds.push(element.projectId);
        }
      });
      sharePostToProjectOrGroupsReq.projectsOrGroupsIds = selectedProjectIds;
      if (selectedProjectIds.length == 0) {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: "Please select an audience for your shared post.",
        });
      } else {
        this.postService
          .shareProjectToProjects(this.loggedInUser.userId, sharePostToProjectOrGroupsReq, this.projectId)
          .subscribe(() => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Group Shared!',
            });
            $('#shareProjectToProjectselect2').val(null).trigger('change');
            this.shareProjectText = "";
            this.selectedShareOption = "";
            $('#project').prop('checked', false);
          });
      }
    } else if (this.selectedShareOption == "group") {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.shareProjectText;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedGroupNames = $('#shareProjectToGroupselect2').val();
      let selectedGroupIds = [];
      this.loggedInUser.groupsJoined.forEach((element) => {
        if (selectedGroupNames.includes(element.name)) {
          selectedGroupIds.push(element.groupId);
        }
      });
      sharePostToProjectOrGroupsReq.projectsOrGroupsIds = selectedGroupIds;
      if (selectedGroupIds.length == 0) {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: "Please select an audience for your shared post.",
        });
      } else {
        this.postService
          .shareProjectToGroups(this.loggedInUser.userId, sharePostToProjectOrGroupsReq, this.projectId)
          .subscribe(() => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Post Shared!',
            });
            $('#shareProjectToGroupselect2').val(null).trigger('change');
            this.shareProjectText = "";
            this.selectedShareOption = "";
            $('#group').prop('checked', false);
          });
      }
    } else if (this.selectedShareOption == "follower") {
      let post = new Post();
      post.text = this.shareProjectText;
      post.postDate = new Date();
      this.postService
        .shareProjectToFollowers(this.loggedInUser.userId, post, this.projectId)
        .subscribe(() => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Post Shared!',
          });
          this.shareProjectText = "";
          this.selectedShareOption = "";
          $('#follower').prop('checked', false);
        });
    } else {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: "Please select an audience for your shared post"
      });
    }
  }
}

