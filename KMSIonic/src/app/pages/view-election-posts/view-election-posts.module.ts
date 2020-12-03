import { PostModule } from './../../shared/post/post.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewElectionPostsPageRoutingModule } from './view-election-posts-routing.module';

import { ViewElectionPostsPage } from './view-election-posts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewElectionPostsPageRoutingModule,
    PostModule
  ],
  declarations: [ViewElectionPostsPage]
})
export class ViewElectionPostsPageModule {}
