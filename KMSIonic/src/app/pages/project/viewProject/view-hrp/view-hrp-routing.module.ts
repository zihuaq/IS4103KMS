import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewHrpPage } from './view-hrp.page';

const routes: Routes = [
  {
    path: '',
    component: ViewHrpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewHrpPageRoutingModule {}
