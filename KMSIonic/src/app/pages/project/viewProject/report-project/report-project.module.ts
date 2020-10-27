import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportProjectPageRoutingModule } from './report-project-routing.module';

import { ReportProjectPage } from './report-project.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportProjectPageRoutingModule
  ],
  declarations: [ReportProjectPage]
})
export class ReportProjectPageModule {}
