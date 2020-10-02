import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from "@angular/router"

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(public authenticationService: AuthenticationService,
    private route: Router) { }

  ngOnInit() {
    this.authenticationService.logout()
  }

  loginPage() {
    this.route.navigate(["/login"])
  }


}
