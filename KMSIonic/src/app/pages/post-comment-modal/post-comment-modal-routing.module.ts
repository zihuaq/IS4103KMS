import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostCommentModalPage } from './post-comment-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PostCommentModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostCommentModalPageRoutingModule {}
