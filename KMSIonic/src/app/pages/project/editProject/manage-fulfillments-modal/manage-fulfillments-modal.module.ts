import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageFulfillmentsModalPageRoutingModule } from './manage-fulfillments-modal-routing.module';

import { ManageFulfillmentsModalPage } from './manage-fulfillments-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageFulfillmentsModalPageRoutingModule
  ],
  declarations: [ManageFulfillmentsModalPage]
})
export class ManageFulfillmentsModalPageModule {}
