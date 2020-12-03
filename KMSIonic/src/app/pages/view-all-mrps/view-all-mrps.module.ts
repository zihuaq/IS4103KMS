import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllMrpsPageRoutingModule } from './view-all-mrps-routing.module';

import { ViewAllMrpsPage } from './view-all-mrps.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllMrpsPageRoutingModule
  ],
  declarations: [ViewAllMrpsPage]
})
export class ViewAllMrpsPageModule {}
