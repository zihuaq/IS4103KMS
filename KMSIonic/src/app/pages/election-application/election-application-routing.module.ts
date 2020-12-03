import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElectionApplicationPage } from './election-application.page';

const routes: Routes = [
  {
    path: '',
    component: ElectionApplicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectionApplicationPageRoutingModule {}
