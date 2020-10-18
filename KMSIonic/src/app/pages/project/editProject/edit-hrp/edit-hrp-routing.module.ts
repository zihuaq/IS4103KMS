import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditHrpPage } from './edit-hrp.page';

const routes: Routes = [
  {
    path: '',
    component: EditHrpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditHrpPageRoutingModule {}
