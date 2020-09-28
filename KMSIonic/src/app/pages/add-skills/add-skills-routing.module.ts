import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSkillsPage } from './add-skills.page';

const routes: Routes = [
  {
    path: '',
    component: AddSkillsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSkillsPageRoutingModule {}
