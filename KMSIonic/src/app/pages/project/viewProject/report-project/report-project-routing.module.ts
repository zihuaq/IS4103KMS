import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportProjectPage } from './report-project.page';

const routes: Routes = [
  {
    path: '',
    component: ReportProjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportProjectPageRoutingModule {}
