import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPostCommentModalPageRoutingModule } from './edit-post-comment-modal-routing.module';

import { EditPostCommentModalPage } from './edit-post-comment-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPostCommentModalPageRoutingModule
  ],
  declarations: [EditPostCommentModalPage]
})
export class EditPostCommentModalPageModule {}
