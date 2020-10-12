import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../classes/post';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { PostService } from '../post.service';
import { UserService } from '../user.service';
import { forkJoin } from 'rxjs';

declare var $: any;
declare var bsCustomFileInput: any;

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {
  selectedFile: string | ArrayBuffer;
  postContent: string;
  createdPost: Post;
  loggedInUser: User;
  newsfeedPosts: Post[];

  constructor(private sessionService: SessionService, private userService: UserService, private postService: PostService) { }

  ngOnInit(): void {
    bsCustomFileInput.init();
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    forkJoin([
      this.userService.getUser(loggedInUserId.toString()),
      this.postService.getPostForUserNewsfeed(loggedInUserId)
    ]).subscribe((result) => {
      this.loggedInUser = result[0];
      this.newsfeedPosts = result[1];
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
          body: "Please select a picture or add some text to your post!",
        });
        return;
      } else {
        this.createdPost.postDate = new Date();
        this.createdPost.text = this.postContent;
        this.createdPost.picture = this.selectedFile;
        this.createdPost.postOwner = this.loggedInUser;

        this.postService.createPost(this.createdPost).subscribe((data: Post) => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Post created!',
          });
          this.postService.getPostForUserNewsfeed(this.loggedInUser.userId).subscribe((result) => {
            this.newsfeedPosts = result;
          });
        }, (err) => {
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Error',
            autohide: true,
            delay: 2500,
            body: err,
          });
        });
      }
    }
  }

  deletePost(postId: number) {
    this.postService.deletePostById(postId).subscribe(() => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Post deleted!',
      });
      this.postService.getPostForUserNewsfeed(this.loggedInUser.userId).subscribe((result) => {
        this.newsfeedPosts = result;
      });
    }, (err) => {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: err,
      });
    });
  }

  likePost(postId: number) {
    this.postService.likePost(this.loggedInUser.userId, postId).subscribe(() => {
      this.postService.getPostForUserNewsfeed(this.loggedInUser.userId).subscribe((result) => {
        this.newsfeedPosts = result;
      });
    })
  }

  removeLikeForPost(postId: number) {
    this.postService.removeLikeForPost(this.loggedInUser.userId, postId).subscribe(() => {
      this.postService.getPostForUserNewsfeed(this.loggedInUser.userId).subscribe((result) => {
        this.newsfeedPosts = result;
      });
    })
  }

  userHaveLikedPost(postId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    let index = post.likers.findIndex((user) => user.userId == this.loggedInUser.userId);
    return index > -1;
  }

  userHaveSharedPost(postId: number) {
    let post = this.newsfeedPosts.find((post) => post.postId == postId);
    let index = post.sharedPosts.findIndex((sharedPost) => sharedPost.postOwner.userId == this.loggedInUser.userId);
    return index > -1;
  }
}