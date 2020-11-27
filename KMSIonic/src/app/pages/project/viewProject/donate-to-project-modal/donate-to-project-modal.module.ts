import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonateToProjectModalPageRoutingModule } from './donate-to-project-modal-routing.module';

import { DonateToProjectModalPage } from './donate-to-project-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonateToProjectModalPageRoutingModule
  ],
  declarations: [DonateToProjectModalPage]
})
export class DonateToProjectModalPageModule {}
