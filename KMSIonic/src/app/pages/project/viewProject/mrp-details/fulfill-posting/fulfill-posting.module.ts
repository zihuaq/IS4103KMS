import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FulfillPostingPageRoutingModule } from './fulfill-posting-routing.module';

import { FulfillPostingPage } from './fulfill-posting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FulfillPostingPageRoutingModule
  ],
  declarations: [FulfillPostingPage]
})
export class FulfillPostingPageModule {}
