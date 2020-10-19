import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateHrpPage } from './create-hrp.page';

const routes: Routes = [
  {
    path: '',
    component: CreateHrpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateHrpPageRoutingModule {}
