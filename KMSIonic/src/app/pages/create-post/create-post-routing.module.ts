import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePostPage } from './create-post.page';

const routes: Routes = [
  {
    path: 'user/create',
    component: CreatePostPage
  },
  {
    path: 'user/edit/:postid',
    component: CreatePostPage
  },
  {
    path: 'group/edit/:postid',
    component: CreatePostPage
  },
  {
    path: 'group/create/:groupid',
    component: CreatePostPage
  },
  {
    path: 'project/edit/:postid',
    component: CreatePostPage
  },
  {
    path: 'project/create/:projectid',
    component: CreatePostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatePostPageRoutingModule {}
