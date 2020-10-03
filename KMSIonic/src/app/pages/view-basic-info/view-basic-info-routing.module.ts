import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBasicInfoPage } from './view-basic-info.page';

const routes: Routes = [
  {
    path: '',
    component: ViewBasicInfoPage
  },
  {
    path: ":userid",
    component: ViewBasicInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewBasicInfoPageRoutingModule {}
