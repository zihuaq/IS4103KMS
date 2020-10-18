import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewHrpPageRoutingModule } from './view-hrp-routing.module';

import { ViewHrpPage } from './view-hrp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewHrpPageRoutingModule
  ],
  declarations: [ViewHrpPage]
})
export class ViewHrpPageModule {}
