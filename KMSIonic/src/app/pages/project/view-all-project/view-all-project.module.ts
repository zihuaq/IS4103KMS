import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllProjectPageRoutingModule } from './view-all-project-routing.module';

import { ViewAllProjectPage } from './view-all-project.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllProjectPageRoutingModule
  ],
  declarations: [ViewAllProjectPage]
})
export class ViewAllProjectPageModule {}
