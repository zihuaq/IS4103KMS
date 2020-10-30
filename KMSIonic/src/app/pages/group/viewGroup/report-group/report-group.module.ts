import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportGroupPageRoutingModule } from './report-group-routing.module';

import { ReportGroupPage } from './report-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportGroupPageRoutingModule
  ],
  declarations: [ReportGroupPage]
})
export class ReportGroupPageModule {}
