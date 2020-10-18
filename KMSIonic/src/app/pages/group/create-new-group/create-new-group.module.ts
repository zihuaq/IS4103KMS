import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewGroupPageRoutingModule } from './create-new-group-routing.module';

import { CreateNewGroupPage } from './create-new-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNewGroupPageRoutingModule
  ],
  declarations: [CreateNewGroupPage]
})
export class CreateNewGroupPageModule {}
