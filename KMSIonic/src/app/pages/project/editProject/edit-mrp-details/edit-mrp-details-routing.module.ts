import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMrpDetailsPage } from './edit-mrp-details.page';

const routes: Routes = [
  {
    path: '',
    component: EditMrpDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMrpDetailsPageRoutingModule {}
