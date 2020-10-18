import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharePostModalPage } from './share-post-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SharePostModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharePostModalPageRoutingModule {}
