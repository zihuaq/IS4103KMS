import { User } from 'src/app/classes/user';
import { MaterialResourceAvailable } from './../../../../classes/material-resource-available';
import { MaterialResourcePosting } from './../../../../classes/material-resource-posting';
import { MatchingService } from './../../../../services/matching.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MrpMatchesRsp } from 'src/app/models/MrpMatchesRsp';
import { MraType } from 'src/app/enum/mra-type.enum';

@Component({
  selector: 'app-mrp-recommendations-modal',
  templateUrl: './mrp-recommendations-modal.page.html',
  styleUrls: ['./mrp-recommendations-modal.page.scss']
})
export class MrpRecommendationsModalPage implements OnInit {
  @Input() mrpId: number;
  mrpToRecommend: MaterialResourcePosting;
  mrpMatches: MrpMatchesRsp[];
  constructor(
    private matchingService: MatchingService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('ngOnInit');
    this.refreshRecommendations();
  }

  refreshRecommendations() {
    this.matchingService.getMatchesForMrp(this.mrpId).subscribe((response) => {
      this.mrpMatches = response;
      this.mrpMatches.splice(10);
      console.log('Recommendations' + this.mrpMatches);
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  goToProfile(user: User) {
    this.dismiss();
    this.router.navigate(['/user-profile/' + user.userId]);
  }

  get mraType(): typeof MraType {
    return MraType;
  }
}
