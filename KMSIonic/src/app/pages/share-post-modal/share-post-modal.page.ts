import { UserService } from 'src/app/services/user.service';
import { Group } from './../../classes/group';
import { Project } from '../../classes/project';
import { PostService } from './../../services/post.service';
import { User } from '../../classes/user';
import { Post } from '../../classes/post';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonTextarea, ModalController, ToastController } from '@ionic/angular';
import { SharePostToProjectOrGroupsReq } from '../../models/SharePostToProjectOrGroupsReq';

@Component({
  selector: 'app-share-post-modal',
  templateUrl: './share-post-modal.page.html',
  styleUrls: ['./share-post-modal.page.scss']
})
export class SharePostModalPage implements OnInit {
  @ViewChild('sharePostInput') sharePostInput: IonTextarea;
  @Input() projectId: number;
  @Input() groupId: number;
  @Input() sharedPost: Post;
  @Input() loggedInUser: User;
  postContent: string;
  shareLocation: string;
  shareToProjects: Project[];
  shareToGroups: Group[];
  projects: Project[];
  groups: Group[];
  constructor(
    private modalController: ModalController,
    private postService: PostService,
    private toastController: ToastController,
    private userService: UserService
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  ionViewDidEnter() {
    this.shareLocation = 'profile';
    setTimeout(() => {
      this.sharePostInput.setFocus();
    }, 150);
    this.userService
      .getProjectsJoined(this.loggedInUser.userId)
      .subscribe((projects) => {
        this.projects = projects;
      });
    this.userService
      .getGroupsJoined(this.loggedInUser.userId)
      .subscribe((groups) => {
        this.groups = groups;
      });
  }

  async sharePost() {
    if (this.shareLocation == 'profile' && !this.projectId && !this.groupId) {
      let post = new Post();
      post.text = this.postContent;
      post.postDate = new Date();
      this.postService
        .sharePost(this.sharedPost.postId, this.loggedInUser.userId, post)
        .subscribe(async () => {
          const toast = await this.toastController.create({
            message: 'Post shared!',
            duration: 2000
          });
          toast.present();
          this.dismiss();
        });
    } else if (
      this.shareLocation == 'profile' &&
      this.projectId &&
      !this.groupId
    ) {
      let post = new Post();
      post.text = this.postContent;
      post.postDate = new Date();
      this.postService
        .shareProjectToFollowers(this.loggedInUser.userId, post, this.projectId)
        .subscribe(async () => {
          const toast = await this.toastController.create({
            message: 'Project shared!',
            duration: 2000
          });
          toast.present();
          this.dismiss();
        });
    } else if (
      this.shareLocation == 'profile' &&
      !this.projectId &&
      this.groupId
    ) {
      let post = new Post();
      post.text = this.postContent;
      post.postDate = new Date();
      this.postService
        .shareGroupToFollowers(this.loggedInUser.userId, post, this.groupId)
        .subscribe(async () => {
          const toast = await this.toastController.create({
            message: 'Group shared!',
            duration: 2000
          });
          toast.present();
          this.dismiss();
        });
    } else if (
      this.shareLocation == 'project' &&
      !this.projectId &&
      !this.groupId
    ) {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.postContent;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedProjectIds = this.shareToProjects.map((project) => {
        return project.projectId;
      });
      sharePostToProjectOrGroupsReq.projectsOrGroupsIds = selectedProjectIds;
      if (selectedProjectIds.length == 0) {
        const toast = await this.toastController.create({
          message: 'Please select an audience to share to.',
          duration: 2000,
          color: 'red'
        });
        toast.present();
      } else {
        this.postService
          .sharePostToProjects(
            this.sharedPost.postId,
            this.loggedInUser.userId,
            sharePostToProjectOrGroupsReq
          )
          .subscribe(async () => {
            const toast = await this.toastController.create({
              message: 'Post shared!',
              duration: 2000
            });
            toast.present();
            this.dismiss();
          });
      }
    } else if (
      this.shareLocation == 'project' &&
      this.projectId &&
      !this.groupId
    ) {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.postContent;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedProjectIds = this.shareToProjects.map((project) => {
        return project.projectId;
      });
      sharePostToProjectOrGroupsReq.projectsOrGroupsIds = selectedProjectIds;
      if (selectedProjectIds.length == 0) {
        const toast = await this.toastController.create({
          message: 'Please select an audience to share to.',
          duration: 2000,
          color: 'red'
        });
        toast.present();
      } else {
        this.postService
          .shareProjectToProjects(
            this.loggedInUser.userId,
            sharePostToProjectOrGroupsReq,
            this.projectId
          )
          .subscribe(async () => {
            const toast = await this.toastController.create({
              message: 'Project shared!',
              duration: 2000
            });
            toast.present();
            this.dismiss();
          });
      }
    } else if (
      this.shareLocation == 'project' &&
      !this.projectId &&
      this.groupId
    ) {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.postContent;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedProjectIds = this.shareToProjects.map((project) => {
        return project.projectId;
      });
      sharePostToProjectOrGroupsReq.projectsOrGroupsIds = selectedProjectIds;
      if (selectedProjectIds.length == 0) {
        const toast = await this.toastController.create({
          message: 'Please select an audience to share to.',
          duration: 2000,
          color: 'red'
        });
        toast.present();
      } else {
        this.postService
          .shareGroupToProjects(
            this.loggedInUser.userId,
            sharePostToProjectOrGroupsReq,
            this.groupId
          )
          .subscribe(async () => {
            const toast = await this.toastController.create({
              message: 'Group shared!',
              duration: 2000
            });
            toast.present();
            this.dismiss();
          });
      }
    } else if (
      this.shareLocation == 'group' &&
      !this.projectId &&
      !this.groupId
    ) {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.postContent;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedGroupIds = this.shareToGroups.map((group) => {
        return group.groupId;
      });
      sharePostToProjectOrGroupsReq.projectsOrGroupsIds = selectedGroupIds;
      if (selectedGroupIds.length == 0) {
        const toast = await this.toastController.create({
          message: 'Please select an audience to share to.',
          duration: 2000,
          color: 'red'
        });
        toast.present();
      } else {
        this.postService
          .sharePostToGroups(
            this.sharedPost.postId,
            this.loggedInUser.userId,
            sharePostToProjectOrGroupsReq
          )
          .subscribe(async () => {
            const toast = await this.toastController.create({
              message: 'Post shared!',
              duration: 2000
            });
            toast.present();
            this.dismiss();
          });
      }
    } else if (
      this.shareLocation == 'group' &&
      this.projectId &&
      !this.groupId
    ) {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.postContent;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedGroupIds = this.shareToGroups.map((group) => {
        return group.groupId;
      });
      sharePostToProjectOrGroupsReq.projectsOrGroupsIds = selectedGroupIds;
      if (selectedGroupIds.length == 0) {
        const toast = await this.toastController.create({
          message: 'Please select an audience to share to.',
          duration: 2000,
          color: 'red'
        });
        toast.present();
      } else {
        this.postService
          .shareProjectToGroups(
            this.loggedInUser.userId,
            sharePostToProjectOrGroupsReq,
            this.projectId
          )
          .subscribe(async () => {
            const toast = await this.toastController.create({
              message: 'Post shared!',
              duration: 2000
            });
            toast.present();
            this.dismiss();
          });
      }
    } else if (
      this.shareLocation == 'group' &&
      !this.projectId &&
      this.groupId
    ) {
      let sharePostToProjectOrGroupsReq = new SharePostToProjectOrGroupsReq();
      sharePostToProjectOrGroupsReq.text = this.postContent;
      sharePostToProjectOrGroupsReq.postDate = new Date();
      let selectedGroupIds = this.shareToGroups.map((group) => {
        return group.groupId;
      });
      sharePostToProjectOrGroupsReq.projectsOrGroupsIds = selectedGroupIds;
      if (selectedGroupIds.length == 0) {
        const toast = await this.toastController.create({
          message: 'Please select an audience to share to.',
          duration: 2000,
          color: 'red'
        });
        toast.present();
      } else {
        this.postService
          .shareGroupToGroups(
            this.loggedInUser.userId,
            sharePostToProjectOrGroupsReq,
            this.groupId
          )
          .subscribe(async () => {
            const toast = await this.toastController.create({
              message: 'Group shared!',
              duration: 2000
            });
            toast.present();
            this.dismiss();
          });
      }
    }
  }
}
