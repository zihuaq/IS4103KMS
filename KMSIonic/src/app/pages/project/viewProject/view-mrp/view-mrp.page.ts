import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Tag } from 'src/app/classes/tag';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { TagService } from 'src/app/services/tag.service';
import { MrpService } from 'src/app/services/mrp.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-view-mrp',
  templateUrl: './view-mrp.page.html',
  styleUrls: ['./view-mrp.page.scss'],
})
export class ViewMrpPage implements OnInit {

  isMember: boolean = false;
  projectId: number;
  project: Project;
  tags: Tag[];
  mrpList: MaterialResourcePosting[];
  noMrp: boolean = true;
  currentUserId: number;

  constructor(private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private tagService: TagService,
    private mrpService: MrpService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {
      this.mrpList = [];
     }

  ngOnInit() {
    this.projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
        console.log(this.currentUserId);
        
        this.projectService.getProjectById(this.projectId).subscribe(
          response => {
            this.project = response;
            for (let member of this.project.projectMembers) {
              if (this.currentUserId == member.userId) {
                this.isMember = true;
              }
            }
          }
        );        
      }
    );

    this.mrpService.getMrpByProject(this.projectId).subscribe(
      response => {
        this.mrpList = response;
        this.mrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
        if (this.mrpList.length > 0) {
          this.noMrp = false;
        }
      }
    );
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

  viewMrpDetails(event, mrp) {
    this.router.navigate(["mrp-details/" + mrp.materialResourcePostingId]);
  }

}
