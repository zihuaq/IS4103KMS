import { PostModule } from '../../../../shared/post/post.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailsPageRoutingModule } from './project-details-routing.module';
import { ViewHrpPageRoutingModule } from '../view-hrp/view-hrp-routing.module';
import { ViewMrpPageRoutingModule } from '../view-mrp/view-mrp-routing.module';

import { ProjectDetailsPage } from './project-details.page';
import { ViewHrpPage } from '../view-hrp/view-hrp.page';
import { ViewMrpPage } from '../view-mrp/view-mrp.page';

import { ViewDocumentsComponent } from '../view-documents/view-documents.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailsPageRoutingModule,
    ViewHrpPageRoutingModule,
    PostModule,
    ViewMrpPageRoutingModule
  ],
  declarations: [ProjectDetailsPage, ViewHrpPage, ViewMrpPage, ViewDocumentsComponent]
})
export class ProjectDetailsPageModule {}
