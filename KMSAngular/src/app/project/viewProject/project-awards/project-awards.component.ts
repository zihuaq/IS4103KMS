import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Award } from 'src/app/classes/award';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { AwardService } from 'src/app/award.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from 'src/app/classes/user';
declare var $: any;

@Component({
  selector: 'app-project-awards',
  templateUrl: './project-awards.component.html',
  styleUrls: ['./project-awards.component.css']
})
export class ProjectAwardsComponent implements OnInit {

  projectId: number;
  project: Project;
  awards: Award[];
  selectedAward: Award;
  newAward: Award
  awardToEdit: Award;
  @ViewChild('awardModal', {static:false}) awardModal: ModalDirective;
  @ViewChild('createAwardModal', {static:false}) createAwardModal: ModalDirective;
  isAdmin: boolean;
  awardPicture:  string | ArrayBuffer;
  awardPictureName: string
  newAwardPicture:  string | ArrayBuffer;
  newAwardPictureName: string
  issueAwardArray: User[];
  withdrawAwardArray: User[];

  constructor(private sessionService: SessionService,
    private awardService: AwardService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private projectService: ProjectService,) {
      this.newAward = new Award();
      this.awardToEdit = new Award();
      this.selectedAward = new Award();
      this.issueAwardArray = []
      this.withdrawAwardArray = []
    }

  ngOnInit(): void {
    console.log('ngOnInit hrpTab')
    this.projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
        for (let member of this.project.projectAdmins) {
          if (this.sessionService.getCurrentUser().userId == member.userId) {
            this.isAdmin = true;
          }
        }
        this.awardService.getAwards(this.projectId).subscribe(
          response =>{
            this.awards = response
          }
        )
      },
      error => {
        this.router.navigate(["/error"]);
      }
    );

  }

  createNewAward(createAwardForm: NgForm){
    if(createAwardForm.valid){
      let newAward = new Award
      newAward.name = createAwardForm.value.name
      newAward.description = createAwardForm.value.description
      newAward.name = createAwardForm.value.name
      newAward.awardPicture = this.newAwardPicture;
      this.awardService.createNewAward(newAward, this.projectId).subscribe(
        response => {
          //close modal
          this.awardService.getAwards(this.projectId).subscribe(
            response => {
              this.awards = response
            }
          )
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Award is successfully created',
          })
      })
    }
  }

  getFilesNewAwardPicture(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.newAwardPicture = e.target.result;
        console.log(this.newAwardPicture);
      };
      this.newAwardPictureName = event.target.files[0].name;
      console.log(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.newAwardPicture = undefined;
    }
  }

  getFileAwardPicture(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.awardPicture = e.target.result;
        console.log(this.awardPicture);
      };
      this.awardPictureName = event.target.files[0].name;
      console.log(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.awardPicture = undefined;
    }
  }

  removePicture() {
    this.awardPicture = undefined;
  }

  editAward(editAwardForm: NgForm){
    if(editAwardForm.valid){

      if(this.awardPicture == null){
        this.awardToEdit.awardPicture = this.selectedAward.awardPicture
      }
      else{
        this.awardToEdit.awardPicture = this.awardPicture
      }

      this.awardService.updateAward(this.awardToEdit).subscribe(
        response =>{
          this.awardService.getAwards(this.projectId).subscribe(
            response => {
              this.awards = response
            }
          )
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Award is successfully updated',
          })
          //close modal
          this.awardToEdit = new Award();
          this.selectedAward = null
        },
        error => {
          $(document).Toasts('create', {
            class: 'bg-warning',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      )
    }
  }

  issueAward(issueAwardForm: NgForm){
    this.awardService.issueAward(this.selectedAward.awardId, issueAwardForm.value.selectedUser).subscribe(
      response =>{
        this.awardService.getAwards(this.projectId).subscribe(
          response => {
            this.awards = response
          }
        )
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'User awarded',
      })

      }
    )
  }

  withdrawAward(withdrawAwardForm: NgForm){
    this.awardService.withdrawAward(this.selectedAward.awardId, withdrawAwardForm.value.selectedUser).subscribe(
      response =>{
        this.awardService.getAwards(this.projectId).subscribe(
          response => {
            this.awards = response
          }
        )
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Award withdrawn',
      })

      }
    )
  }

  deleteAward(){
    this.awardService.deleteAward(this.selectedAward.awardId).subscribe(
      response=>{
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Award is successfully updated',
      }
    )
    this.awardService.getAwards(this.projectId).subscribe(
      response => {
        this.awards = response
      }
    )
  })

}

onAwardSelected(awardData: Award){
  this.selectedAward = awardData;
  console.log(this.selectedAward.awardId)
  this.awardToEdit.awardId = this.selectedAward.awardId
  this.awardToEdit.name = this.selectedAward.name
  this.awardToEdit.description = this.selectedAward.description
  this.awardToEdit.awardPicture = this.selectedAward.awardPicture

  this.withdrawAwardArray =  this.selectedAward.usersReceived;

  this.issueAwardArray = []

  for(let member of this.project.projectMembers){
    let recievedAward = false;
    for(let recieved of this.selectedAward.usersReceived){
      if (member.userId == recieved.userId){
      recievedAward = true;
      }
    }
    if (recievedAward == false && member.userId != this.sessionService.getCurrentUser().userId){
      this.issueAwardArray.push(member)
    }

  }

  this.awardModal.show();

}

hideChildModal(){
  this.awardModal.hide();
}

onCreateAward(){
  this.createAwardModal.show();
}

hideCreateAwardModal(){
  this.createAwardModal.hide();
}

}
