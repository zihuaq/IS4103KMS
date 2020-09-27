import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgetpasswordPageRoutingModule } from './forgetpassword-routing.module';

import { ForgetpasswordPage } from './forgetpassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgetpasswordPageRoutingModule
  ],
  declarations: [ForgetpasswordPage]
})
export class ForgetpasswordPageModule {}
