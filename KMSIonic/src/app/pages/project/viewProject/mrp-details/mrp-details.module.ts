import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MrpDetailsPageRoutingModule } from './mrp-details-routing.module';

import { MrpDetailsPage } from './mrp-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MrpDetailsPageRoutingModule
  ],
  declarations: [MrpDetailsPage]
})
export class MrpDetailsPageModule {}
