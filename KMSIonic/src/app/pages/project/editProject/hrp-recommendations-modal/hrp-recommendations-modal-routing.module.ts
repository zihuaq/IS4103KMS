import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrpRecommendationsModalPage } from './hrp-recommendations-modal.page';

const routes: Routes = [
  {
    path: '',
    component: HrpRecommendationsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrpRecommendationsModalPageRoutingModule {}
