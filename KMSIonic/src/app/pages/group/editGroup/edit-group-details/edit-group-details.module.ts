import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditGroupDetailsPageRoutingModule } from './edit-group-details-routing.module';

import { EditGroupDetailsPage } from './edit-group-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditGroupDetailsPageRoutingModule
  ],
  declarations: [EditGroupDetailsPage]
})
export class EditGroupDetailsPageModule {}
