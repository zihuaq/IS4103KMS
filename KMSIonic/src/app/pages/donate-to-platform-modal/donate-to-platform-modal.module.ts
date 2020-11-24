import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonateToPlatformModalPageRoutingModule } from './donate-to-platform-modal-routing.module';

import { DonateToPlatformModalPage } from './donate-to-platform-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonateToPlatformModalPageRoutingModule
  ],
  declarations: [DonateToPlatformModalPage]
})
export class DonateToPlatformModalPageModule {}
