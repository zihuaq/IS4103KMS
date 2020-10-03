import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

import { AddMaterialResourceAvailablePage } from "./add-material-resource-available.page"

const routes: Routes = [
  {
    path: "",
    component: AddMaterialResourceAvailablePage
  },
  {
    path: ":mraId",
    component: AddMaterialResourceAvailablePage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddMaterialResourceAvailablePageRoutingModule {}
