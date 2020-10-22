import { EditPostCommentModalPageModule } from './../../pages/edit-post-comment-modal/edit-post-comment-modal.module';
import { SharedModule } from './../shared.module';
import { NewsfeedComponent } from './../../components/newsfeed/newsfeed.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PostCommentModalPageModule } from '../../pages/post-comment-modal/post-comment-modal.module';
import { SharePostModalPageModule } from '../../pages/share-post-modal/share-post-modal.module';
import { ReportPostModalPageModule } from '../../pages/report-post-modal/report-post-modal.module';
import { ReportCommentModalPageModule } from '../../pages/report-comment-modal/report-comment-modal.module';

@NgModule({
  declarations: [NewsfeedComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    PostCommentModalPageModule,
    SharePostModalPageModule,
    ReportPostModalPageModule,
    EditPostCommentModalPageModule,
    ReportCommentModalPageModule
  ],
  exports: [NewsfeedComponent]
})
export class PostModule {}
