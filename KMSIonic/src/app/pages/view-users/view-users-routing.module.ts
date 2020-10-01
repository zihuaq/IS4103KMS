import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

import { ViewUsersPage } from "./view-users.page"

const routes: Routes = [
  {
    path: "followers/:userid",
    component: ViewUsersPage
  },
  {
    path: "following/:userid",
    component: ViewUsersPage
  },
  {
    path: "affiliated/:userid",
    component: ViewUsersPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewUsersPageRoutingModule {}
