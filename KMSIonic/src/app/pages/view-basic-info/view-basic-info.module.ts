import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewBasicInfoPageRoutingModule } from './view-basic-info-routing.module';

import { ViewBasicInfoPage } from './view-basic-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewBasicInfoPageRoutingModule
  ],
  declarations: [ViewBasicInfoPage]
})
export class ViewBasicInfoPageModule {}
