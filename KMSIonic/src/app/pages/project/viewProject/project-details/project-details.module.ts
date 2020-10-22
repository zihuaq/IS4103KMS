import { PostModule } from '../../../../shared/post/post.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailsPageRoutingModule } from './project-details-routing.module';
import { ViewHrpPageRoutingModule } from '../view-hrp/view-hrp-routing.module';

import { ViewHrpPage } from '../view-hrp/view-hrp.page';
import { ProjectDetailsPage } from './project-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailsPageRoutingModule,
    ViewHrpPageRoutingModule,
    PostModule
  ],
  declarations: [ProjectDetailsPage, ViewHrpPage]
})
export class ProjectDetailsPageModule {}
