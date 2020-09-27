import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-userselector',
  templateUrl: './userselector.page.html',
  styleUrls: ['./userselector.page.scss'],
})
export class UserselectorPage implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  directInst() {
    this.route.navigate(['/registerinstitution']);
  }

  directInd() {
    this.route.navigate(['/register']);
  }

}
