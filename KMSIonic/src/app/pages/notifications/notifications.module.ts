import { AllRequestsPage } from "./all-requests/all-requests.page"
import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import { IonicModule } from "@ionic/angular"

import { NotificationsPageRoutingModule } from "./notifications-routing.module"

import { NotificationsPage } from "./notifications.page"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsPageRoutingModule
  ],
  declarations: [NotificationsPage, AllRequestsPage]
})
export class NotificationsPageModule {}
