import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMembersPageRoutingModule } from './edit-members-routing.module';

import { EditMembersPage } from './edit-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditMembersPageRoutingModule
  ],
  declarations: [EditMembersPage]
})
export class EditMembersPageModule {}
