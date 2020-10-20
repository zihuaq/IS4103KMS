import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabPanelPageRoutingModule } from './tab-panel-routing.module';

import { EditProjectDetailsPageRoutingModule } from '../edit-project-details/edit-project-details-routing.module';

import { EditMembersPageRoutingModule } from '../edit-members/edit-members-routing.module';

import { EditHrpPageRoutingModule } from '../edit-hrp/edit-hrp-routing.module';

import { TabPanelPage } from './tab-panel.page';
import { EditProjectDetailsPage } from '../edit-project-details/edit-project-details.page';
import { EditMembersPage } from '../edit-members/edit-members.page';
import { EditHrpPage } from '../edit-hrp/edit-hrp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabPanelPageRoutingModule,
    EditProjectDetailsPageRoutingModule,
    EditMembersPageRoutingModule,
    EditHrpPageRoutingModule
  ],
  declarations: [TabPanelPage, EditProjectDetailsPage, EditMembersPage,EditHrpPage]
})
export class TabPanelPageModule {}
