import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserselectorPage } from './userselector.page';

const routes: Routes = [
  {
    path: '',
    component: UserselectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserselectorPageRoutingModule {}
