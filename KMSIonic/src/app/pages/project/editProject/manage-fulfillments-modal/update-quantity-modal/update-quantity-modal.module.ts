import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateQuantityModalPageRoutingModule } from './update-quantity-modal-routing.module';

import { UpdateQuantityModalPage } from './update-quantity-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateQuantityModalPageRoutingModule
  ],
  declarations: [UpdateQuantityModalPage]
})
export class UpdateQuantityModalPageModule {}
