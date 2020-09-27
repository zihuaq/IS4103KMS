import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSkillsPage } from './view-skills.page';

const routes: Routes = [
  {
    path: '',
    component: ViewSkillsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSkillsPageRoutingModule {}
