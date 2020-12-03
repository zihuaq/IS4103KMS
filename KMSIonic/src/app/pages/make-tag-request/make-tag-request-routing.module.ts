import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MakeTagRequestPage } from './make-tag-request.page';

const routes: Routes = [
  {
    path: '',
    component: MakeTagRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MakeTagRequestPageRoutingModule {}
