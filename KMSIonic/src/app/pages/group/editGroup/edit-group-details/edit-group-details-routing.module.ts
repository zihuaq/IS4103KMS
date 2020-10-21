import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditGroupDetailsPage } from './edit-group-details.page';

const routes: Routes = [
  {
    path: '',
    component: EditGroupDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditGroupDetailsPageRoutingModule {}
