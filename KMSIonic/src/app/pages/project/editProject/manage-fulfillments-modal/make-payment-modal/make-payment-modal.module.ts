import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MakePaymentModalPageRoutingModule } from './make-payment-modal-routing.module';

import { MakePaymentModalPage } from './make-payment-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MakePaymentModalPageRoutingModule
  ],
  declarations: [MakePaymentModalPage]
})
export class MakePaymentModalPageModule {}
