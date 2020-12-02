import { User } from 'src/app/classes/user';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { MatchingService } from './../../../../services/matching.service';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hrp-recommendations-modal',
  templateUrl: './hrp-recommendations-modal.page.html',
  styleUrls: ['./hrp-recommendations-modal.page.scss']
})
export class HrpRecommendationsModalPage implements OnInit {
  @Input() hrpId: number;
  hrpToRecommend: HumanResourcePosting;
  userRecommendations: User[];
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
    this.matchingService.getMatchesForHrp(this.hrpId).subscribe((response) => {
      this.userRecommendations = response;
      this.userRecommendations.splice(10);
      console.log('.ts file ' + this.userRecommendations);
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
