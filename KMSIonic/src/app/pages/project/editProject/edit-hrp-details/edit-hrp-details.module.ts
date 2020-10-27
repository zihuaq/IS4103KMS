import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditHrpDetailsPageRoutingModule } from './edit-hrp-details-routing.module';

import { EditHrpDetailsPage } from './edit-hrp-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditHrpDetailsPageRoutingModule
  ],
  declarations: [EditHrpDetailsPage]
})
export class EditHrpDetailsPageModule {}
