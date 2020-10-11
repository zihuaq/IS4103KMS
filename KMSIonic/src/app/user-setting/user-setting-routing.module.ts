import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSettingPage } from './user-setting.page';

const routes: Routes = [
  {
    path: '',
    component: UserSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSettingPageRoutingModule {}
