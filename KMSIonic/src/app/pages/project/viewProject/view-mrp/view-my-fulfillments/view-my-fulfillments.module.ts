import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewMyFulfillmentsPageRoutingModule } from './view-my-fulfillments-routing.module';

import { ViewMyFulfillmentsPage } from './view-my-fulfillments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewMyFulfillmentsPageRoutingModule
  ],
  declarations: [ViewMyFulfillmentsPage]
})
export class ViewMyFulfillmentsPageModule {}
