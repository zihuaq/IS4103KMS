import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewMrpPageRoutingModule } from './view-mrp-routing.module';

import { ViewMrpPage } from './view-mrp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewMrpPageRoutingModule
  ],
  declarations: [ViewMrpPage]
})
export class ViewMrpPageModule {}
