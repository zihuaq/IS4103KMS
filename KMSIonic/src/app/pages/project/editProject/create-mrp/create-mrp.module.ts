import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateMrpPageRoutingModule } from './create-mrp-routing.module';

import { CreateMrpPage } from './create-mrp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateMrpPageRoutingModule
  ],
  declarations: [CreateMrpPage]
})
export class CreateMrpPageModule {}
