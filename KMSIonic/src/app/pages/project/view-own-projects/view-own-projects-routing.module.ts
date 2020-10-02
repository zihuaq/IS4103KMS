import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewOwnProjectsPage } from './view-own-projects.page';

const routes: Routes = [
  {
    path: '',
    component: ViewOwnProjectsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewOwnProjectsPageRoutingModule {}
