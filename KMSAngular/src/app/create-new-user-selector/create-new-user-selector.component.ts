import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-new-user-selector',
  templateUrl: './create-new-user-selector.component.html',
  styleUrls: ['./create-new-user-selector.component.css']
})
export class CreateNewUserSelectorComponent implements OnInit {

  entity:string;
  description = "Mouse over to see what each means"
  onIndividual: true;
  onInstitution:false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectIndividual(){
    this.router.navigate(['signup']);
  }

  redirectInstitution(){
    this.router.navigate(['signupInstitution']);
  }

  individualMouseEnter(){
    this.description = "I am an individual contributor"
    this.entity = "Individual"
  }

  institutionMouseEnter(){
    this.description = "I am an representing a institution"
    this.entity = "Institution"
  }

}
