import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MrpDetailsPage } from './mrp-details.page';

const routes: Routes = [
  {
    path: '',
    component: MrpDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MrpDetailsPageRoutingModule {}
