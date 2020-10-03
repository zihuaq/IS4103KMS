import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPanelPage } from './tab-panel.page';

const routes: Routes = [
  {
    path: '',
    component: TabPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPanelPageRoutingModule {}
