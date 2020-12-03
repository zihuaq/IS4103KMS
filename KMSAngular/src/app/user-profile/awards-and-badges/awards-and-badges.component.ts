import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { SessionService } from 'src/app/session.service';
import { AwardService } from 'src/app/award.service';
import { Project } from 'src/app/classes/project';
import { Award } from 'src/app/classes/award';
import { Badge   } from 'src/app/classes/Badge';
import { UserService } from 'src/app/user.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-awards-and-badges',
  templateUrl: './awards-and-badges.component.html',
  styleUrls: ['./awards-and-badges.component.css']
})
export class AwardsAndBadgesComponent implements OnInit {

  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  projectId: number;
  projects: string[] = [];
  awards: Award[] = [];
  badges: Badge[] = [];
  toggle = "badges"

  joinGroupBadge: Badge = new Badge();
  joinProjectBadge: Badge = new Badge();
  createGroupBadge: Badge = new Badge();
  createProjectBadge: Badge = new Badge();
  completeActivityBadge: Badge = new Badge();
  createReviewBadge: Badge = new Badge();

  joinGroupBadgeTier: number
  joinProjectBadgeTier: number
  createGroupBadgeTier: number
  createProjectBadgeTier: number
  completeActivityBadgeTier: number
  createReviewBadgeTier: number


  constructor(private sessionService: SessionService,
    private awardService: AwardService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getBadges().subscribe(
      response =>{
        this.badges = response;
        this.joinGroupBadge = this.badges.find(b => b.name === "Joined a Group Milestone")
        this.joinProjectBadge = this.badges.find(b => b.name === "Joined a Project Milestone")
        this.createProjectBadge = this.badges.find(b => b.name === "Created a Project Milestone")
        this.createGroupBadge = this.badges.find(b => b.name === "Created a Group Milestone")
        this.completeActivityBadge = this.badges.find(b => b.name === "Completed an Activity Milestone")
        this.createReviewBadge = this.badges.find(b => b.name === "Created a Review Milestone")

        // groups Joined badge
        if(this.profile.countOfGroupsJoined >= this.joinGroupBadge.tierThreeRequirement){
          this.joinGroupBadgeTier = 3
        }
        else if(this.profile.countOfGroupsJoined >= this.joinGroupBadge.tierTwoRequirement){
          this.joinGroupBadgeTier = 2
        }
        else if(this.profile.countOfGroupsJoined >= this.joinGroupBadge.tierOneRequirement){
          this.joinGroupBadgeTier = 1
        }
        else {
          this.joinGroupBadgeTier = 0
        }

        console.log(this.joinGroupBadge)

        // project Joined badge
        if(this.profile.countOfProjectsJoined >= this.joinProjectBadge.tierThreeRequirement){
          this.joinProjectBadgeTier = 3
        }
        else if(this.profile.countOfProjectsJoined >= this.joinProjectBadge.tierTwoRequirement){
          this.joinProjectBadgeTier = 2
        }
        else if(this.profile.countOfProjectsJoined >= this.joinProjectBadge.tierOneRequirement){
          this.joinProjectBadgeTier = 1
        }
        else {
          this.joinProjectBadgeTier = 0
        }


        // group created badge
        if(this.profile.countOfGroupsCreated >= this.createGroupBadge.tierThreeRequirement){
          this.createGroupBadgeTier = 3
        }
        else if(this.profile.countOfGroupsCreated >= this.createGroupBadge.tierTwoRequirement){
          this.createGroupBadgeTier = 2
        }
        else if(this.profile.countOfGroupsCreated >= this.createGroupBadge.tierOneRequirement){
          this.createGroupBadgeTier = 1
        }
        else {
          this.createGroupBadgeTier = 0
        }

        // project created badge
        if(this.profile.countOfProjectsCreated >= this.createProjectBadge.tierThreeRequirement){
          this.createProjectBadgeTier = 3
        }
        else if(this.profile.countOfProjectsCreated >= this.createProjectBadge.tierTwoRequirement){
          this.createProjectBadgeTier = 2
        }
        else if(this.profile.countOfProjectsCreated >= this.createProjectBadge.tierOneRequirement){
          this.createProjectBadgeTier = 1
        }
        else {
          this.createProjectBadgeTier = 0
        }

        //activity completed badge
        if(this.profile.countOfActivitiesCompleted >= this.completeActivityBadge.tierThreeRequirement){
          this.completeActivityBadgeTier = 3
        }
        else if(this.profile.countOfActivitiesCompleted >= this.completeActivityBadge.tierTwoRequirement){
          this.completeActivityBadgeTier = 2
        }
        else if(this.profile.countOfActivitiesCompleted >= this.completeActivityBadge.tierOneRequirement){
          this.completeActivityBadgeTier = 1
        }
        else {
          this.completeActivityBadgeTier = 0
        }

        //reviews created badge
        if(this.profile.countOfReviewsCreated >= this.createReviewBadge.tierThreeRequirement){
          this.createReviewBadgeTier = 3
        }
        else if(this.profile.countOfReviewsCreated >= this.createReviewBadge.tierTwoRequirement){
          this.createReviewBadgeTier = 2
        }
        else if(this.profile.countOfReviewsCreated >= this.createReviewBadge.tierOneRequirement){
          this.createReviewBadgeTier = 1
        }
        else {
          this.createReviewBadgeTier = 0
        }
      }
    )

    this.userService.getAwardsReceived(this.profile.userId).subscribe(
      response => {
        this.awards = response

      }
    )
    for (let award of this.awards){
      if(!this.projects.includes(award.project.name)){
        this.projects.push(award.project.name)
      }
    }
  }

  onToggleAward(){
    this.toggle = "awards"
  }

  onToggleBadge(){
    this.toggle = "badges"
  }

}
