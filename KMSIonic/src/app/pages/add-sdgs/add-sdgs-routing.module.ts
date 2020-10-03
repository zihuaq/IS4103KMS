import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSdgsPage } from './add-sdgs.page';

const routes: Routes = [
  {
    path: '',
    component: AddSdgsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSdgsPageRoutingModule {}
