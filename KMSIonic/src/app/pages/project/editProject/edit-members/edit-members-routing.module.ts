import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditMembersPage } from './edit-members.page';

const routes: Routes = [
  {
    path: '',
    component: EditMembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditMembersPageRoutingModule {}
