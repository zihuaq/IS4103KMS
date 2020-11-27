import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfilePage } from './user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UserProfilePage
  },
  {
    path: ':userid',
    component: UserProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfilePageRoutingModule {}
