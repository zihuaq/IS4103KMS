import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMraPageRoutingModule } from './add-mra-routing.module';

import { AddMraPage } from './add-mra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMraPageRoutingModule
  ],
  declarations: [AddMraPage]
})
export class AddMraPageModule {}
