import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"
import { DetailedSearchPage } from "./detailed-search/detailed-search.page"

import { SearchUsersPage } from "./search-users.page"

const routes: Routes = [
  {
    path: "",
    component: SearchUsersPage
  },
  {
    path: "details",
    component: DetailedSearchPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchUsersPageRoutingModule {}
