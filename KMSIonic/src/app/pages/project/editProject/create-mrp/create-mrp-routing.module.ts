import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMrpPage } from './create-mrp.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMrpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMrpPageRoutingModule {}
