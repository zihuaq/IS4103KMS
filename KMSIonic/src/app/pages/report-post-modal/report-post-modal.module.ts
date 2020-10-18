import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportPostModalPageRoutingModule } from './report-post-modal-routing.module';

import { ReportPostModalPage } from './report-post-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPostModalPageRoutingModule
  ],
  declarations: [ReportPostModalPage]
})
export class ReportPostModalPageModule {}
