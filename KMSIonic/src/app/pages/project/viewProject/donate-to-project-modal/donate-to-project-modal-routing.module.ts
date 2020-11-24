import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonateToProjectModalPage } from './donate-to-project-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DonateToProjectModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonateToProjectModalPageRoutingModule {}
