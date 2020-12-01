import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewRecommendationsPage } from './view-recommendations.page';

const routes: Routes = [
  {
    path: '',
    component: ViewRecommendationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRecommendationsPageRoutingModule {}
