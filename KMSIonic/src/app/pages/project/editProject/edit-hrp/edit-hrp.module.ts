import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditHrpPageRoutingModule } from './edit-hrp-routing.module';

import { EditHrpPage } from './edit-hrp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditHrpPageRoutingModule
  ],
  declarations: [EditHrpPage]
})
export class EditHrpPageModule {}
