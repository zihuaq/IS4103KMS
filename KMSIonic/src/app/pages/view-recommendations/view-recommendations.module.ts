import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewRecommendationsPageRoutingModule } from './view-recommendations-routing.module';

import { ViewRecommendationsPage } from './view-recommendations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewRecommendationsPageRoutingModule
  ],
  declarations: [ViewRecommendationsPage]
})
export class ViewRecommendationsPageModule {}
