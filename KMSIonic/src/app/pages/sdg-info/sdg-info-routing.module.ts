import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SdgInfoPage } from './sdg-info.page';

const routes: Routes = [
  {
    path: '',
    component: SdgInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SdgInfoPageRoutingModule {}
