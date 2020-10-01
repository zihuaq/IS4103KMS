import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllProjectPage } from './view-all-project.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllProjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllProjectPageRoutingModule {}
