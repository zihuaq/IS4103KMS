import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../classes/post';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { forkJoin } from 'rxjs';
import { PostComment } from '../classes/post-comment';
import { Report } from '../classes/report';
import { Tag } from '../classes/tag';
import { TagService } from '../tag.service';

declare var $: any;
declare var bsCustomFileInput: any;

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css'],
})
export class NewsfeedComponent implements OnInit {
  selectedFile: string | ArrayBuffer;
  postContent: string;
  createdPost: Post;
  loggedInUser: User;
  newsfeedPosts: Post[];
  editingComment: PostComment;
  commentToDeleteId: number;
  report: Report;
  reportTags: Tag[];
  selectedTags: Tag[];
  selectedTagNames: string[];
  postToReport: Post;

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private postService: PostService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    bsCustomFileInput.init();
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    forkJoin([
      this.userService.getUser(loggedInUserId.toString()),
      this.postService.getPostForUserNewsfeed(loggedInUserId),
      this.tagService.getAllReportTags(),
    ]).subscribe((result) => {
      this.loggedInUser = result[0];
      this.newsfeedPosts = result[1];
      this.reportTags = result[2];
      $('#reportnewsfeedselect2').select2({
        data: this.reportTags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });
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

        this.postService.createPost(this.createdPost).subscribe(
          (data: Post) => {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Success',
              autohide: true,
              delay: 2500,
              body: 'Post created!',
            });
            this.postService
              .getPostForUserNewsfeed(this.loggedInUser.userId)
              .subscribe((result) => {
                this.newsfeedPosts = result;
              });
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
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
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
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
      });
  }

  removeLikeForPost(postId: number) {
    this.postService
      .removeLikeForPost(this.loggedInUser.userId, postId)
      .subscribe(() => {
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
      });
  }

  addComment(text: string, postId: number) {
    let comment = new PostComment();
    let user = new User();
    user.userId = this.loggedInUser.userId;
    // user.profilePicture = this.loggedInUser.profilePicture;
    // user.firstName = this.loggedInUser.firstName;
    // user.lastName = this.loggedInUser.lastName;
    comment.commentOwner = user;
    comment.comment = text;
    comment.dateTime = new Date();
    this.postService.addCommentForPost(postId, comment).subscribe(() => {
      this.postService
        .getPostForUserNewsfeed(this.loggedInUser.userId)
        .subscribe((result) => {
          this.newsfeedPosts = result;
        });
    });
  }

  likeComment(commentId: number) {
    this.postService
      .likeComment(this.loggedInUser.userId, commentId)
      .subscribe(() => {
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
      });
  }

  removeLikeForComment(commentId: number) {
    this.postService
      .removeLikeForComment(this.loggedInUser.userId, commentId)
      .subscribe(() => {
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
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
        this.postService
          .getPostForUserNewsfeed(this.loggedInUser.userId)
          .subscribe((result) => {
            this.newsfeedPosts = result;
          });
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
      this.postService
        .getPostForUserNewsfeed(this.loggedInUser.userId)
        .subscribe((result) => {
          this.newsfeedPosts = result;
        });
    });
  }

  reportPost() {}

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
}
