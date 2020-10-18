import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllGroupPage } from './view-all-group.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllGroupPageRoutingModule {}
