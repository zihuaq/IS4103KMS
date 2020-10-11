import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateNewProjectPage } from './create-new-project.page';

const routes: Routes = [
  {
    path: '',
    component: CreateNewProjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateNewProjectPageRoutingModule {}
