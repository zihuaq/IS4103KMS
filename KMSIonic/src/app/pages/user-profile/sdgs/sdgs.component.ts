import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sdgs',
  templateUrl: './sdgs.component.html',
  styleUrls: ['./sdgs.component.scss'],
})
export class SDGsComponent implements OnInit {

  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  seeAll: boolean = false;
  profileIsLoggedInUser = false;
  top3SDGs: Tag[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.profileIsLoggedInUser = this.profile.userId == this.loggedInUser.userId
    this.userService
      .getSDGsForProfile(this.profile.userId)
      .subscribe((sdgs) => {
        this.profile = { ...this.profile, sdgs };
        this.top3SDGs = this.profile.sdgs.slice(0, 3)
      });
  }

  toggleSeeAll() {
    this.seeAll = !this.seeAll
  }
}
