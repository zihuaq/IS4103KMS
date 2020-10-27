import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMraModalPageRoutingModule } from './add-mra-modal-routing.module';

import { AddMraModalPage } from './add-mra-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMraModalPageRoutingModule
  ],
  declarations: [AddMraModalPage]
})
export class AddMraModalPageModule {}
