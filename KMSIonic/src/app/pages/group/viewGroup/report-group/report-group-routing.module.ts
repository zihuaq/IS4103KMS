import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportGroupPage } from './report-group.page';

const routes: Routes = [
  {
    path: '',
    component: ReportGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportGroupPageRoutingModule {}
