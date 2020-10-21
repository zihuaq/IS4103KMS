import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditMrpDetailsPageRoutingModule } from './edit-mrp-details-routing.module';

import { EditMrpDetailsPage } from './edit-mrp-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditMrpDetailsPageRoutingModule
  ],
  declarations: [EditMrpDetailsPage]
})
export class EditMrpDetailsPageModule {}
