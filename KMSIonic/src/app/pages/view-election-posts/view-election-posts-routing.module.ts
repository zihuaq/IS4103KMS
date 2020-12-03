import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewElectionPostsPage } from './view-election-posts.page';

const routes: Routes = [
  {
    path: '',
    component: ViewElectionPostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewElectionPostsPageRoutingModule {}
