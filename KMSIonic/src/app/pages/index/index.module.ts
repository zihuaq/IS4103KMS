import { ReportPostModalPageModule } from './../report-post-modal/report-post-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndexPageRoutingModule } from './index-routing.module';

import { IndexPage } from './index.page';
import { PostCommentModalPageModule } from '../post-comment-modal/post-comment-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndexPageRoutingModule,
    PostCommentModalPageModule,
    ReportPostModalPageModule
  ],
  declarations: [IndexPage]
})
export class IndexPageModule {}
