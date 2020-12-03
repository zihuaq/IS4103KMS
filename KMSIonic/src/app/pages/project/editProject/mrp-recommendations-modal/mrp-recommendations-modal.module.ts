import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MrpRecommendationsModalPageRoutingModule } from './mrp-recommendations-modal-routing.module';

import { MrpRecommendationsModalPage } from './mrp-recommendations-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MrpRecommendationsModalPageRoutingModule
  ],
  declarations: [MrpRecommendationsModalPage]
})
export class MrpRecommendationsModalPageModule {}
