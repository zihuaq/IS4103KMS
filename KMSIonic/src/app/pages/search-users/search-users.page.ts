import { Component, OnInit, ViewChild } from "@angular/core"
import { Location } from "@angular/common"
import { Platform } from "@ionic/angular"
import { IonSearchbar } from "@ionic/angular"

@Component({
  selector: "app-search-users",
  templateUrl: "./search-users.page.html",
  styleUrls: ["./search-users.page.scss"]
})
export class SearchUsersPage implements OnInit {
  @ViewChild("searchBar") searchBar: IonSearchbar

  constructor(private location: Location, private platform: Platform) {}

  ngOnInit() {
    setTimeout(() => {
      this.searchBar.setFocus()
    }, 150)
  }

  goBack() {
    this.location.back()
  }
}
