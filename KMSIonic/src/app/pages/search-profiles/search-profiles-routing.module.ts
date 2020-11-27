import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchProfilesPage } from './search-profiles.page';

const routes: Routes = [
  {
    path: '',
    component: SearchProfilesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchProfilesPageRoutingModule {}
