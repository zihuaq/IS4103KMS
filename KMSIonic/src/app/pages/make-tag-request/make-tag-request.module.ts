import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MakeTagRequestPageRoutingModule } from './make-tag-request-routing.module';

import { MakeTagRequestPage } from './make-tag-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MakeTagRequestPageRoutingModule
  ],
  declarations: [MakeTagRequestPage]
})
export class MakeTagRequestPageModule {}
