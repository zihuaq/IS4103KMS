import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNewGroupPage } from './create-new-group.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNewGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNewGroupPageRoutingModule {}
