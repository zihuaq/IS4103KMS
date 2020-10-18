import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HrpDetailsPageRoutingModule } from './hrp-details-routing.module';

import { HrpDetailsPage } from './hrp-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HrpDetailsPageRoutingModule
  ],
  declarations: [HrpDetailsPage]
})
export class HrpDetailsPageModule {}
