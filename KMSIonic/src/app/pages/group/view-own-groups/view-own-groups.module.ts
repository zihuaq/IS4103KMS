import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewOwnGroupsPageRoutingModule } from './view-own-groups-routing.module';

import { ViewOwnGroupsPage } from './view-own-groups.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewOwnGroupsPageRoutingModule
  ],
  declarations: [ViewOwnGroupsPage]
})
export class ViewOwnGroupsPageModule {}
