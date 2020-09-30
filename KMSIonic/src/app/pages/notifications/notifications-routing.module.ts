import { AllRequestsPage } from "./all-requests/all-requests.page"
import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

import { NotificationsPage } from "./notifications.page"

const routes: Routes = [
  {
    path: "",
    component: NotificationsPage
  },
  {
    path: "all-follow",
    component: AllRequestsPage
  },
  {
    path: "all-affiliation",
    component: AllRequestsPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsPageRoutingModule {}
