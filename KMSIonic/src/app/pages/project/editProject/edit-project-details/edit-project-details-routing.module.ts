import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProjectDetailsPage } from './edit-project-details.page';

const routes: Routes = [
  {
    path: '',
    component: EditProjectDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProjectDetailsPageRoutingModule {}
