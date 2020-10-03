import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSdgsPageRoutingModule } from './add-sdgs-routing.module';

import { AddSdgsPage } from './add-sdgs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSdgsPageRoutingModule
  ],
  declarations: [AddSdgsPage]
})
export class AddSdgsPageModule {}
