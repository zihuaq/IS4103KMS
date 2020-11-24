import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DonateToPlatformModalPage } from './donate-to-platform-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DonateToPlatformModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DonateToPlatformModalPageRoutingModule {}
