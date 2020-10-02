import { MaterialResourceAvailable } from "./../../../classes/material-resource-available"
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core"
import { User } from "src/app/classes/user"

@Component({
  selector: "app-material-resource-available",
  templateUrl: "./material-resource-available.component.html",
  styleUrls: ["./material-resource-available.component.scss"]
})
export class MaterialResourceAvailableComponent implements OnInit {
  @Input() profile: User
  @Input() loggedInUser: User
  @Output() userChanged = new EventEmitter<User>()
  seeAll: boolean = false
  profileIsLoggedInUser = false
  top2Mras: MaterialResourceAvailable[]
  constructor() {}

  ngOnInit() {
    this.top2Mras = this.profile.mras.slice(0, 2)
    this.profileIsLoggedInUser = this.profile.userId == this.loggedInUser.userId
  }

  toggleSeeAll() {
    this.seeAll = !this.seeAll
  }
}
