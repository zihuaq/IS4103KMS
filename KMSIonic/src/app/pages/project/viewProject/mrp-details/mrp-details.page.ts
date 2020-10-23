import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MrpService } from 'src/app/services/mrp.service';
import { ProjectService } from 'src/app/services/project.service';
import { MaterialResourcePosting } from '../../../../classes/material-resource-posting';
import { Project } from '../../../../classes/project';

@Component({
  selector: 'app-mrp-details',
  templateUrl: './mrp-details.page.html',
  styleUrls: ['./mrp-details.page.scss'],
})
export class MrpDetailsPage implements OnInit {

  currentUserId: number;
  mrpId: number;
  mrp: MaterialResourcePosting;
  startDate: string;
  endDate: string;
  currentProject: Project;
  isMember: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private mrpService: MrpService,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService) {
      this.mrp = new MaterialResourcePosting();
      this.mrp.tags = [];
      this.currentProject = new Project();
     }

  ngOnInit() {
    this.refreshMrp();
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
    this.refreshMrp();
  }

  refreshMrp() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );

    this.mrpId = parseInt(this.activatedRoute.snapshot.paramMap.get("mrpId"));
    
    this.mrpService.getMrp(this.mrpId).subscribe(
      response => {
        this.mrp = response;
        this.startDate = this.mrp.startDate.toString().slice(0, 19);
        this.endDate = this.mrp.endDate.toString().slice(0, 19);
        
        this.projectService.getProjectById(this.mrp.project.projectId).subscribe(
          response => {
            this.currentProject = response;
            for (let member of this.currentProject.projectMembers) {
              if (this.currentUserId == member.userId) {
                this.isMember = true;
              }
            }
          }
        ); 
      }
    );
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

}
