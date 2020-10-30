import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../classes/post';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { forkJoin, iif } from 'rxjs';
import { PostComment } from '../classes/post-comment';
import { Report } from '../classes/report';
import { Tag } from '../classes/tag';
import { TagService } from '../tag.service';
import { ProjectService } from '../project.service';
import { Project } from '../classes/project';
import { SharePostToProjectOrGroupsReq } from '../models/SharePostToProjectOrGroupsReq';
import { number } from 'currency-codes';
import { ReportType } from '../classes/report-type.enum';
import { ReportService } from '../report.service';
import { GroupService } from '../group.service';
import { Group } from '../classes/group';
import { UserType } from '../classes/user-type.enum';

declare var $: any;
declare var bsCustomFileInput: any;

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css'],
})
export class NewsfeedComponent implements OnInit {
  @Input()
  newsfeedType: string
  @Input()
  id: number
  selectedFile: string | ArrayBuffer;
  selectedFileName: string | ArrayBuffer;
  postContent: string;
  createdPost: Post;
  loggedInUser: User;
  newsfeedPosts: Post[];
  filteredNewsfeedPosts: Post[];
  editingComment: PostComment;
  postToDeleteId: number;
  commentToDeleteId: number;
  postToShare: Post;
  report: Report;
  postReportTags: Tag[];
  commentReportTags: Tag[];
  postToReport: Post;
  commentToReport: PostComment;
  isAdminOrOwner: boolean;
  isMember: boolean;
  project: Project;
  shareOption: any = [
    { id: "follower", value: "Followers" },
    { id: "project", value: "Project(s)" },
    { id: "group", value: "Group(s)" }
  ];
  selectedShareOption: string;
  sharePostText: string = "";
  group: Group;
  searchString: string = "";
  filterOptions: any = [
    { id: "All", value: "All" },
    { id: "Shared posts", value: "Shared Posts" },
    { id: "Posts with images", value: "Posts with images" }
  ]
  selectedFilterOption: string
  postImageToEnlarge: Post
  UserType = UserType;

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private postService: PostService,
    private tagService: TagService,
    private projectService: ProjectService,
    private reportService: ReportService,
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    if (this.newsfeedType == "project") {
      forkJoin([
        this.userService.getUser(loggedInUserId.toString()),
        this.postService.getPostForProjectNewsfeed(this.id),
        this.tagService.getAllPostReportTags(),
        this.projectService.getProjectById(this.id),
        this.tagService.getAllCommentReportTags()
      ]).subscribe((result) => {
        this.loggedInUser = result[0];
        this.newsfeedPosts = result[1];
        this.filteredNewsfeedPosts = this.newsfeedPosts;
        this.postReportTags = result[2];
        this.project = result[3];
        this.commentReportTags = result[4];
        let memberIndex = this.project.projectMembers.findIndex(
          (user) => user.userId == this.loggedInUser.userId
        );
        let adminIndex = this.project.projectAdmins.findIndex(
          (user) => user.userId == this.loggedInUser.userId
        );
        if (this.project.projectOwner.userId == this.loggedInUser.userId || adminIndex > -1) {
          this.isAdminOrOwner = true;
          this.isMember = true;
        } else if (memberIndex > -1) {
          this.isMember = true
        }
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
        bsCustomFileInput.init();
      });
    } else if (this.newsfeedType == "group") {
      forkJoin([
        this.userService.getUser(loggedInUserId.toString()),
        this.postService.getPostForGroupNewsfeed(this.id),
        this.tagService.getAllPostReportTags(),
        this.groupService.getGroupById(this.id),
        this.tagService.getAllCommentReportTags()
      ]).subscribe((result) => {
        this.loggedInUser = result[0];
        this.newsfeedPosts = result[1];
        this.filteredNewsfeedPosts = this.newsfeedPosts;
        this.postReportTags = result[2];
        this.group = result[3];
        this.commentReportTags = result[4];
        let memberIndex = this.group.groupMembers.findIndex(
          (user) => user.userId == this.loggedInUser.userId
        );
        let adminIndex = this.group.groupAdmins.findIndex(
          (user) => user.userId == this.loggedInUser.userId
        );
        if (this.group.groupOwner.userId == this.loggedInUser.userId || adminIndex > -1) {
          this.isAdminOrOwner = true;
          this.isMember = true;
        } else if (memberIndex > -1) {
          this.isMember = true
        }
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
        bsCustomFileInput.init();
      });
    } else if (this.newsfeedType == "profile") {
      forkJoin([
        this.userService.getUser(loggedInUserId.toString()),
        this.postService.getPostForProfileNewsfeed(this.id),
        this.tagService.getAllPostReportTags(),
        this.tagService.getAllCommentReportTags()
      ]).subscribe((result) => {
        this.loggedInUser = result[0];
        this.newsfeedPosts = result[1];
        this.filteredNewsfeedPosts = this.newsfeedPosts;
        this.postReportTags = result[2];
        this.commentReportTags = result[3];
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
        bsCustomFileInput.init();
      });
    } else {
      forkJoin([
        this.userService.getUser(loggedInUserId.toString()),
        this.postService.getPostForUserNewsfeed(loggedInUserId),
        this.tagService.getAllPostReportTags(),
        this.tagService.getAllCommentReportTags()
      ]).subscribe((result) => {
        this.loggedInUser = result[0];
        this.newsfeedPosts = result[1];
        this.filteredNewsfeedPosts = this.newsfeedPosts;
        this.postReportTags = result[2];
        this.commentReportTags = result[3];
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
        bsCustomFileInput.init();
      });
    }
  }

  getFiles(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedFile = e.target.result;
        console.log(this.selectedFile);
      };
      console.log(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedFileName = event.target.files[0].name;
    } else {
      this.selectedFile = undefined;
    }
  }

  onCreatePost(createPostForm: NgForm) {
    this.createdPost = new Post();

    if (createPostForm.valid) {
      if (this.postContent == null && this.selectedFile == null) {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: 'Please select a picture or add some text to your post!',
        });
        return;
      } else {
        this.createdPost.postDate = new Date();
        this.createdPost.text = this.postContent;
        this.createdPost.picture = this.selectedFile;
        this.createdPost.postOwner = this.loggedInUser;
        if (this.newsfeedType == "project") {
          this.createdPost.project = this.project;
        } else if (this.newsfeedType == "group") {
          this.createdPost.group = this.group;
        }

        this.postService.createPost(this.createdPost).subscribe(
          (data: Post) => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Post created!',
            });
            this.postContent = null;
            this.selectedFile = null;
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
    }
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
    if (this.newsfeedType == "project") {
      this.postService
        .getPostForProjectNewsfeed(this.id)
        .subscribe((result) => {
          this.newsfeedPosts = result;
          this.updateNewsFeedAccordingToRefineOptions();
        });
    } else if (this.newsfeedType == "group") {
      this.postService
        .getPostForGroupNewsfeed(this.id)
        .subscribe((result) => {
          this.newsfeedPosts = result;
          this.updateNewsFeedAccordingToRefineOptions();
        });
    } else if (this.newsfeedType == "profile") {
      this.postService
        .getPostForProfileNewsfeed(this.id)
        .subscribe((result) => {
          this.newsfeedPosts = result;
          this.updateNewsFeedAccordingToRefineOptions();
        });
    } else {
      this.postService
        .getPostForUserNewsfeed(this.loggedInUser.userId)
        .subscribe((result) => {
          this.newsfeedPosts = result;
          this.updateNewsFeedAccordingToRefineOptions();
        });
    }
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
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    this.postToShare = post;
  }

  setPostToReport(postId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    this.postToReport = post;
    this.report = new Report();
  }

  userHaveLikedPost(postId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    let index = post.likers.findIndex(
      (user) => user.userId == this.loggedInUser.userId
    );
    return index > -1;
  }

  userHaveLikedComment(postId: number, commentId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    let comment = post.comments.find(
      (comment) => comment.postCommentId == commentId
    );
    let index = comment.likers.findIndex(
      (user) => user.userId == this.loggedInUser.userId
    );
    return index > -1;
  }

  userHaveSharedPost(postId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    let index = post.sharedPosts.findIndex(
      (sharedPost) => sharedPost.postOwner.userId == this.loggedInUser.userId
    );
    return index > -1;
  }

  setEditingComment(postId: number, commentId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    let comment = post.comments.find(
      (comment) => comment.postCommentId == commentId
    );
    this.editingComment = comment;
  }

  setCommentToReport(postId: number, commentId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
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

  handleSearchStringChanged(event) {
    this.searchString = event;
    this.updateNewsFeedAccordingToRefineOptions();
  }

  updateNewsFeedAccordingToRefineOptions() {
    this.filteredNewsfeedPosts = [];
    if (this.selectedFilterOption == "Shared posts") {
      this.newsfeedPosts.forEach(post => {
        if (this.postMatchSearchString(post) && post.originalPost) {
          this.filteredNewsfeedPosts.push(post);
        }
      });
    } else if (this.selectedFilterOption == "Posts with images") {
      this.newsfeedPosts.forEach(post => {
        if (this.postMatchSearchString(post) && post.picture || this.postMatchSearchString(post) && (post.sharedProjectId || post.sharedGroupId)) {
          this.filteredNewsfeedPosts.push(post);
        }
      });
    } else {
      this.newsfeedPosts.forEach(post => {
        if (this.postMatchSearchString(post)) {
          this.filteredNewsfeedPosts.push(post);
        }
      });
    }
  }

  postMatchSearchString(post: Post) {
    if (this.searchString == null || this.searchString == "") {
      return true;
    }
    if (post.text && post.text.toLowerCase().includes(this.searchString.toLowerCase()) || post.originalPost &&
      post.originalPost.text.toLowerCase().includes(this.searchString.toLowerCase())) {
      return true;
    }
  }

  onSelectedFilterOptionChange(event) {
    if (event.target.value == "All") {
      this.selectedFilterOption = null;
    } else {
      this.selectedFilterOption = event.target.value;
    }
    this.updateNewsFeedAccordingToRefineOptions();
  }

  setPostImageToEnlarge(post) {
    this.postImageToEnlarge = post;
  }
}
