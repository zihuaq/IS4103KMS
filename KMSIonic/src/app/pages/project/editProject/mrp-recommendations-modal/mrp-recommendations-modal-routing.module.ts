import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MrpRecommendationsModalPage } from './mrp-recommendations-modal.page';

const routes: Routes = [
  {
    path: '',
    component: MrpRecommendationsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MrpRecommendationsModalPageRoutingModule {}
