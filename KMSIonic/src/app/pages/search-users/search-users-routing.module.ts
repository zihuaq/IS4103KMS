import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchUsersPage } from './search-users.page';

const routes: Routes = [
  {
    path: '',
    component: SearchUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchUsersPageRoutingModule {}
