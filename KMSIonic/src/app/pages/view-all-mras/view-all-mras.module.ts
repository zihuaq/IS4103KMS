import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllMrasPageRoutingModule } from './view-all-mras-routing.module';

import { ViewAllMrasPage } from './view-all-mras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllMrasPageRoutingModule
  ],
  declarations: [ViewAllMrasPage]
})
export class ViewAllMrasPageModule {}
