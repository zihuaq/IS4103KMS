import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewOwnProjectsPageRoutingModule } from './view-own-projects-routing.module';

import { ViewOwnProjectsPage } from './view-own-projects.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewOwnProjectsPageRoutingModule
  ],
  declarations: [ViewOwnProjectsPage]
})
export class ViewOwnProjectsPageModule {}
