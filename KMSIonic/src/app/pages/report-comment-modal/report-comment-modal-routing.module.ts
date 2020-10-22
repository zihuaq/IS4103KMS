import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportCommentModalPage } from './report-comment-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ReportCommentModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportCommentModalPageRoutingModule {}
