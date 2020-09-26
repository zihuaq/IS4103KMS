import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SdgInfoPageRoutingModule } from './sdg-info-routing.module';

import { SdgInfoPage } from './sdg-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SdgInfoPageRoutingModule
  ],
  declarations: [SdgInfoPage]
})
export class SdgInfoPageModule {}
