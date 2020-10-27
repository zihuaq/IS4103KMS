import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateHrpPageRoutingModule } from './create-hrp-routing.module';

import { CreateHrpPage } from './create-hrp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateHrpPageRoutingModule
  ],
  declarations: [CreateHrpPage]
})
export class CreateHrpPageModule {}
