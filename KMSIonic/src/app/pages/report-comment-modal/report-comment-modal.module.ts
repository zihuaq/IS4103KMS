import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportCommentModalPageRoutingModule } from './report-comment-modal-routing.module';

import { ReportCommentModalPage } from './report-comment-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportCommentModalPageRoutingModule
  ],
  declarations: [ReportCommentModalPage]
})
export class ReportCommentModalPageModule {}
