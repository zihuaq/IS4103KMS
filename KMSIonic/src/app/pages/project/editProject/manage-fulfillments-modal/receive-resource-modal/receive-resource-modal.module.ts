import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiveResourceModalPageRoutingModule } from './receive-resource-modal-routing.module';

import { ReceiveResourceModalPage } from './receive-resource-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiveResourceModalPageRoutingModule
  ],
  declarations: [ReceiveResourceModalPage]
})
export class ReceiveResourceModalPageModule {}
