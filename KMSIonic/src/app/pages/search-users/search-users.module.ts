import { DetailedSearchPage } from "./detailed-search/detailed-search.page"
import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import { IonicModule } from "@ionic/angular"

import { SearchUsersPageRoutingModule } from "./search-users-routing.module"

import { SearchUsersPage } from "./search-users.page"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchUsersPageRoutingModule
  ],
  declarations: [SearchUsersPage, DetailedSearchPage]
})
export class SearchUsersPageModule {}
