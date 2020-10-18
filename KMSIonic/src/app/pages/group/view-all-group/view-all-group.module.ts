import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllGroupPageRoutingModule } from './view-all-group-routing.module';

import { ViewAllGroupPage } from './view-all-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllGroupPageRoutingModule
  ],
  declarations: [ViewAllGroupPage]
})
export class ViewAllGroupPageModule {}
