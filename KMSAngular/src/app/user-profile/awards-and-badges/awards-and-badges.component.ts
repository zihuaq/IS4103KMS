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

  constructor(private sessionService: SessionService,
    private awardService: AwardService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getBadges().subscribe(
      response =>{
        this.badges = response;
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
