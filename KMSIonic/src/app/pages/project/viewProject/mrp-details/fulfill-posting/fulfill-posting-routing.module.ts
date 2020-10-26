import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FulfillPostingPage } from './fulfill-posting.page';

const routes: Routes = [
  {
    path: '',
    component: FulfillPostingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FulfillPostingPageRoutingModule {}
