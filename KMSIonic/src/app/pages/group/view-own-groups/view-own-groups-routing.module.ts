import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewOwnGroupsPage } from './view-own-groups.page';

const routes: Routes = [
  {
    path: '',
    component: ViewOwnGroupsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewOwnGroupsPageRoutingModule {}
