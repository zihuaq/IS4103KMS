import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateFulfillmentModalPageRoutingModule } from './update-fulfillment-modal-routing.module';

import { UpdateFulfillmentModalPage } from './update-fulfillment-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateFulfillmentModalPageRoutingModule
  ],
  declarations: [UpdateFulfillmentModalPage]
})
export class UpdateFulfillmentModalPageModule {}
