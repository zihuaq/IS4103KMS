import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeactivateAccountPage } from './deactivate-account.page';

const routes: Routes = [
  {
    path: '',
    component: DeactivateAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeactivateAccountPageRoutingModule {}
