import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditBasicInfoPageRoutingModule } from './edit-basic-info-routing.module';

import { EditBasicInfoPage } from './edit-basic-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditBasicInfoPageRoutingModule
  ],
  declarations: [EditBasicInfoPage]
})
export class EditBasicInfoPageModule {}
