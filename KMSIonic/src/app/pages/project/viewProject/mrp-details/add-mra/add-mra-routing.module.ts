import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMraPage } from './add-mra.page';

const routes: Routes = [
  {
    path: '',
    component: AddMraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMraPageRoutingModule {}
