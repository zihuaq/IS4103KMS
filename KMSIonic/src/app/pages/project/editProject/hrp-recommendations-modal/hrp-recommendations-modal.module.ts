import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HrpRecommendationsModalPageRoutingModule } from './hrp-recommendations-modal-routing.module';

import { HrpRecommendationsModalPage } from './hrp-recommendations-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HrpRecommendationsModalPageRoutingModule
  ],
  declarations: [HrpRecommendationsModalPage]
})
export class HrpRecommendationsModalPageModule {}
