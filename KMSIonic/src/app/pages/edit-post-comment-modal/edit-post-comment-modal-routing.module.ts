import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPostCommentModalPage } from './edit-post-comment-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EditPostCommentModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPostCommentModalPageRoutingModule {}
