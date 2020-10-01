import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSdgsPageRoutingModule } from './view-sdgs-routing.module';

import { ViewSdgsPage } from './view-sdgs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewSdgsPageRoutingModule
  ],
  declarations: [ViewSdgsPage]
})
export class ViewSdgsPageModule {}
