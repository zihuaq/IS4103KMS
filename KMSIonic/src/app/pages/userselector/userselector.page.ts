import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"

@Component({
  selector: "app-userselector",
  templateUrl: "./userselector.page.html",
  styleUrls: ["./userselector.page.scss"]
})
export class UserselectorPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  directInst() {
    this.router.navigate(["/registerinstitution"])
  }

  directInd() {
    this.router.navigate(["/register"])
  }
}
