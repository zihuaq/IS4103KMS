import { EditPostCommentModalPage } from './../edit-post-comment-modal/edit-post-comment-modal.page';
import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostCommentModalPageRoutingModule } from './post-comment-modal-routing.module';

import { PostCommentModalPage } from './post-comment-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostCommentModalPageRoutingModule,
    SharedModule
  ],
  declarations: [PostCommentModalPage, EditPostCommentModalPage]
})
export class PostCommentModalPageModule {}
