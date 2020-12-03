import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Project } from 'src/app/classes/project';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { MatchingService } from 'src/app/matching.service';
import { ProjectRecommendationBasedOnFollowingRsp } from 'src/app/models/ProjectRecommendationBasedOnFollowingRsp';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';

declare var $: any;

@Component({
  selector: 'app-project-recommendations',
  templateUrl: './project-recommendations.component.html',
  styleUrls: ['./project-recommendations.component.css']
})
export class ProjectRecommendationsComponent implements OnInit {

  currentUser: User;
  projectRecoBySDG: Project[];
  projectRecoByFollowing: ProjectRecommendationBasedOnFollowingRsp[];
  hasRecommendations: Boolean;
  loggedInUserProjects: Project[];
  ProjectType = ProjectType;
  fullView: boolean = false;

  constructor(private sessionService: SessionService, private matchingService: MatchingService,
    private projectService: ProjectService, private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.sessionService.getCurrentUser();
    this.updateComponent();
  }

  updateComponent() {
    forkJoin([
      this.matchingService.getProjectRecommendationsBasedOnSDG(this.currentUser.userId),
      this.matchingService.getProjectRecommendationsBasedOnFollowing(this.currentUser.userId),
      this.userService.getProjectsJoined(this.currentUser.userId),
    ]).subscribe((result) => {
      this.projectRecoBySDG = result[0];
      this.projectRecoByFollowing = result[1];
      this.loggedInUserProjects = result[2];
      if (this.projectRecoBySDG.length == 0 && this.projectRecoByFollowing.length == 0) {
        this.hasRecommendations = false;
      } else {
        this.hasRecommendations = true;
      }
    })
  }

  joinProject(project: Project) {
    console.log("******** joinProject()");
    this.projectService.joinProject(project.projectId, this.currentUser.userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Welcome to the project',
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

  toggleFullView() {
    this.fullView = !this.fullView;
  }
}
