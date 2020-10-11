import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMaterialResourceAvailablePageRoutingModule } from './add-material-resource-available-routing.module';

import { AddMaterialResourceAvailablePage } from './add-material-resource-available.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMaterialResourceAvailablePageRoutingModule
  ],
  declarations: [AddMaterialResourceAvailablePage]
})
export class AddMaterialResourceAvailablePageModule {}
