import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabPanelPageRoutingModule } from './tab-panel-routing.module';

import { EditGroupDetailsPageRoutingModule } from '../edit-group-details/edit-group-details-routing.module';

import { EditMembersPageRoutingModule } from '../edit-members/edit-members-routing.module';

import { TabPanelPage } from './tab-panel.page';
import { EditGroupDetailsPage } from '../edit-group-details/edit-group-details.page';
import { EditMembersPage } from '../edit-members/edit-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabPanelPageRoutingModule,
    EditGroupDetailsPageRoutingModule,
    EditMembersPageRoutingModule
  ],
  declarations: [TabPanelPage, EditGroupDetailsPage, EditMembersPage]
})
export class TabPanelPageModule {}
