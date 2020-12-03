import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElectionApplicationPageRoutingModule } from './election-application-routing.module';

import { ElectionApplicationPage } from './election-application.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ElectionApplicationPageRoutingModule
  ],
  declarations: [ElectionApplicationPage]
})
export class ElectionApplicationPageModule {}
