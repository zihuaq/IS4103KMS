import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Election } from '../classes/election';
import { Post } from '../classes/post';
import { PostComment } from '../classes/post-comment';
import { Report } from '../classes/report';
import { Tag } from '../classes/tag';
import { User } from '../classes/user';
import { UserType } from '../classes/user-type.enum';
import { ElectionService } from '../election.service';
import { PostService } from '../post.service';
import { ReportService } from '../report.service';
import { SessionService } from '../session.service';
import { TagService } from '../tag.service';
import { UserService } from '../user.service';
import { ReportType } from '../classes/report-type.enum';
import { NgForm } from '@angular/forms';
import { ElectionApplication } from '../classes/election-application';
import { SharePostToProjectOrGroupsReq } from '../models/SharePostToProjectOrGroupsReq';

declare var $: any;

@Component({
  selector: 'app-view-election-posts',
  templateUrl: './view-election-posts.component.html',
  styleUrls: ['./view-election-posts.component.css']
})
export class ViewElectionPostsComponent implements OnInit {

  loggedInUser: User;
  electionPosts: Post[];
  filteredPosts: Post[];
  editingComment: PostComment;
  postToDeleteId: number;
  commentToDeleteId: number;
  postToShare: Post;
  report: Report;
  postReportTags: Tag[];
  commentReportTags: Tag[];
  postToReport: Post;
  commentToReport: PostComment;
  shareOption: any = [
    { id: "follower", value: "Followers" },
    { id: "project", value: "Project(s)" },
    { id: "group", value: "Group(s)" }
  ];
  selectedShareOption: string;
  sharePostText: string = "";
  UserType = UserType;
  activeElections: Election;


  constructor(private sessionService: SessionService,
    private userService: UserService,
    private postService: PostService,
    private tagService: TagService,
    private reportService: ReportService,
    private electionService: ElectionService,) { }

  ngOnInit(): void {
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    this.electionService.getActiveElection().subscribe(
      (result) => {
        this.activeElections = result;
        forkJoin([
          this.userService.getUser(loggedInUserId.toString()),
          this.postService.getPostForElection(this.activeElections.id),
          this.tagService.getAllPostReportTags(),
          this.tagService.getAllCommentReportTags()
        ]).subscribe((result) => {
          this.loggedInUser = result[0];
          this.electionPosts = result[1];
          this.filteredPosts = this.electionPosts;
          this.postReportTags = result[2];
          this.commentReportTags = result[3];
          this.initElements();
        });
      });
  }


  initElements() {
    console.log("init elements called!")
    $('#reportPostselect2').select2({
      data: this.postReportTags.map((item) => {
        return item.name;
      }),
      allowClear: true,
    });
    $('#reportCommentselect2').select2({
      data: this.commentReportTags.map((item) => {
        return item.name;
      }),
      allowClear: true,
    });
    $('#shareToProjectselect2').select2({
      data: this.loggedInUser.projectsJoined.map((item) => {
        return item.name;
      }),
      allowClear: true,
    });
    $('#shareToGroupselect2').select2({
      data: this.loggedInUser.groupsJoined.map((item) => {
        return item.name;
      }),
      allowClear: true,
    });
  }

  deletePost(postId: number) {
    this.postService.deletePostById(postId).subscribe(
      () => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Post deleted!',
        });
        this.updateNewsfeed();
      },
      (err) => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: err,
        });
      }
    );
  }

  likePost(postId: number) {
    this.postService
      .likePost(this.loggedInUser.userId, postId)
      .subscribe(() => {
        this.updateNewsfeed();
      });
  }

  updateNewsfeed() {
    this.postService
      .getPostForUserNewsfeed(this.loggedInUser.userId)
      .subscribe((result) => {
        this.filteredPosts = result;
      });
  }


  removeLikeForPost(postId: number) {
    this.postService
      .removeLikeForPost(this.loggedInUser.userId, postId)
      .subscribe(() => {
        this.updateNewsfeed();
      });
  }

  addComment(text: string, postId: number) {
    let comment = new PostComment();
    let user = new User();
    user.userId = this.loggedInUser.userId;
    comment.commentOwner = user;
    comment.comment = text;
    comment.dateTime = new Date();
    this.postService.addCommentForPost(postId, comment).subscribe(() => {
      this.updateNewsfeed();
    });
  }

  likeComment(commentId: number) {
    this.postService
      .likeComment(this.loggedInUser.userId, commentId)
      .subscribe(() => {
        this.updateNewsfeed();
      });
  }

  removeLikeForComment(commentId: number) {
    this.postService
      .removeLikeForComment(this.loggedInUser.userId, commentId)
      .subscribe(() => {
        this.updateNewsfeed();
      });
  }

  deleteComment(commentId: number) {
    this.postService.deleteComment(commentId).subscribe(
      () => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Comment deleted!',
        });
        this.updateNewsfeed();
      },
      (err) => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: err,
        });
      }
    );
  }

  updateComment() {
    this.postService.updateComment(this.editingComment).subscribe(() => {
      this.editingComment = null;
      this.updateNewsfeed();
    });
  }

  sharePost() {
    if (this.selectedShareOption == "project") {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.sharePostText;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedProjectNames = $('#shareToProjectselect2').val();
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
          .sharePostToProjects(this.postToShare.postId, this.loggedInUser.userId, sharePostToProjectOrGroupsReq)
          .subscribe(() => {
            this.postToShare = null;
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Post Shared!',
            });
            this.updateNewsfeed();
            $('#shareToProjectselect2').val(null).trigger('change');
            this.sharePostText = "";
            this.selectedShareOption = "";
            $('#project').prop('checked', false);
          });
      }
    } else if (this.selectedShareOption == "group") {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.sharePostText;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedGroupNames = $('#shareToGroupselect2').val();
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
          .sharePostToGroups(this.postToShare.postId, this.loggedInUser.userId, sharePostToProjectOrGroupsReq)
          .subscribe(() => {
            this.postToShare = null;
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Post Shared!',
            });
            this.updateNewsfeed();
            $('#shareToGroupselect2').val(null).trigger('change');
            this.sharePostText = "";
            this.selectedShareOption = "";
            $('#group').prop('checked', false);
          });
      }
    } else if (this.selectedShareOption == "follower") {
      let post = new Post();
      post.text = this.sharePostText;
      post.postDate = new Date();
      this.postService
        .sharePost(this.postToShare.postId, this.loggedInUser.userId, post)
        .subscribe(() => {
          this.postToShare = null;
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Post Shared!',
          });
          this.updateNewsfeed();
          this.sharePostText = "";
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

  reportPost() {
    let selectedTags = [];
    let selectedTagNames = $('#reportPostselect2').val();
    if (selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Report',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one concern',
      });
      return;
    }
    this.postReportTags.forEach((element) => {
      if (selectedTagNames.includes(element.name)) {
        selectedTags.push(element);
      }
    });
    this.report.reportType = ReportType.POST;
    this.report.reportOwner = this.loggedInUser;
    this.report.reportedPost = this.postToReport;
    this.report.reportTags = selectedTags;
    this.report.resolved = false;
    this.reportService.reportPost(this.report).subscribe(() => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Report Submitted Successfully',
        autohide: true,
        delay: 2500,
      });
      $('#report-post-modal').modal('hide');
      $('#reportPostselect2').val(null).trigger('change');
    });
  }

  setPostToShare(postId: number) {
    let post = this.electionPosts.find((post) => post.postId == postId);
    this.postToShare = post;
  }

  setPostToReport(postId: number) {
    let post = this.electionPosts.find((post) => post.postId == postId);
    this.postToReport = post;
    this.report = new Report();
  }

  userHaveLikedPost(postId: number) {
    let post = this.electionPosts.find((post) => post.postId == postId);
    let index = post.likers.findIndex(
      (user) => user.userId == this.loggedInUser.userId
    );
    return index > -1;
  }

  userHaveLikedComment(postId: number, commentId: number) {
    let post = this.electionPosts.find((post) => post.postId == postId);
    let comment = post.comments.find(
      (comment) => comment.postCommentId == commentId
    );
    let index = comment.likers.findIndex(
      (user) => user.userId == this.loggedInUser.userId
    );
    return index > -1;
  }

  userHaveSharedPost(postId: number) {
    let post = this.electionPosts.find((post) => post.postId == postId);
    let index = post.sharedPosts.findIndex(
      (sharedPost) => sharedPost.postOwner.userId == this.loggedInUser.userId
    );
    return index > -1;
  }

  setEditingComment(postId: number, commentId: number) {
    let post = this.electionPosts.find((post) => post.postId == postId);
    let comment = post.comments.find(
      (comment) => comment.postCommentId == commentId
    );
    this.editingComment = comment;
  }

  setCommentToReport(postId: number, commentId: number) {
    let post = this.electionPosts.find((post) => post.postId == postId);
    let comment = post.comments.find(
      (comment) => comment.postCommentId == commentId
    );
    this.commentToReport = comment;
    this.report = new Report();
  }

  reportComment() {
    let selectedTags = [];
    let selectedTagNames = $('#reportCommentselect2').val();
    if (selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit Report',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one concern',
      });
      return;
    }
    this.commentReportTags.forEach((element) => {
      if (selectedTagNames.includes(element.name)) {
        selectedTags.push(element);
      }
    });
    this.report.reportType = ReportType.COMMENT;
    this.report.reportOwner = this.loggedInUser;
    this.report.reportedComment = this.commentToReport;
    this.report.reportTags = selectedTags;
    this.report.resolved = false;
    this.reportService.reportComment(this.report).subscribe(() => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Report Submitted Successfully',
        autohide: true,
        delay: 2500,
      });
      $('#report-comment-modal').modal('hide');
      $('#reportCommentselect2').val(null).trigger('change');
    });
  }

  onSelectedShareOptionChange(event) {
    this.selectedShareOption = event.target.value;
  }

  clear(electionForm: NgForm) {
    electionForm.reset();
  }

  applyForElection(electionForm: NgForm) {
    if (electionForm.valid) {
      if (this.activeElections.minRepPointsRequired <= this.loggedInUser.reputationPoints && this.loggedInUser.userType == UserType.INDIVIDUAL) {
        let electionApplciation = new ElectionApplication();
        electionApplciation.reasons = electionForm.value.reason;
        electionApplciation.contributions = electionForm.value.contributions;
        electionApplciation.additionalComments = electionForm.value.notes;
        electionApplciation.applicationDate = new Date();
        electionApplciation.applicationOwner = this.loggedInUser;
        electionApplciation.election = this.activeElections;

        this.electionService.createElectionApplication(electionApplciation).subscribe(
          (response) => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Application Submitted!',
            });

            electionForm.reset();
            $('#applyElectionModalCloseBtn').click();
          },
          (error) => {
            $(document).Toasts('create', {
              class: 'bg-danger',
              title: 'Error',
              autohide: true,
              delay: 2500,
              body: error,
            });

            electionForm.reset();
            $('#applyElectionModalCloseBtn').click();
          }
        );
      } else if (this.loggedInUser.userType == UserType.ADMIN) {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: "Admin cannot participation in an election for new admins",
        });
        electionForm.reset();
        $('#applyElectionModalCloseBtn').click();
      } else if (this.loggedInUser.userType == UserType.INSTITUTE) {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: "Institute Accounts cannot participation in an election for new admins",
        });
        electionForm.reset();
        $('#applyElectionModalCloseBtn').click();
      } else {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: "Insufficient Reputation Points",
        });
        electionForm.reset();
        $('#applyElectionModalCloseBtn').click();
      }
    }
  }




}
