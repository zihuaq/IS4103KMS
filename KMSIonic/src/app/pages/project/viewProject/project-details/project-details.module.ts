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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectDetailsPageRoutingModule,
    ViewHrpPageRoutingModule,
    ViewMrpPageRoutingModule
  ],
  declarations: [ProjectDetailsPage, ViewHrpPage, ViewMrpPage]
})
export class ProjectDetailsPageModule {}
