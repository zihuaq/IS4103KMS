import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportPostModalPage } from './report-post-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ReportPostModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportPostModalPageRoutingModule {}
