import { User } from 'src/app/classes/user';
import { MaterialResourceAvailable } from './../../../../classes/material-resource-available';
import { MaterialResourcePosting } from './../../../../classes/material-resource-posting';
import { MatchingService } from './../../../../services/matching.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mrp-recommendations-modal',
  templateUrl: './mrp-recommendations-modal.page.html',
  styleUrls: ['./mrp-recommendations-modal.page.scss']
})
export class MrpRecommendationsModalPage implements OnInit {
  @Input() mrpId: number;
  mrpToRecommend: MaterialResourcePosting;
  mraRecommendations: MaterialResourceAvailable[];
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
      this.mraRecommendations = response;
      this.mraRecommendations.splice(10);
      console.log('Recommendations' + this.mraRecommendations);
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  goToProfile(user: User) {
    this.dismiss();
    this.router.navigate(['/user-profile/' + user.userId]);
  }
}
