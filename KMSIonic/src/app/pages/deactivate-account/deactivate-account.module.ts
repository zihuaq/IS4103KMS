import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeactivateAccountPageRoutingModule } from './deactivate-account-routing.module';

import { DeactivateAccountPage } from './deactivate-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeactivateAccountPageRoutingModule
  ],
  declarations: [DeactivateAccountPage]
})
export class DeactivateAccountPageModule {}
