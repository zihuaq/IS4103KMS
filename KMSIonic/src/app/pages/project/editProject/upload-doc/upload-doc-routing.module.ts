import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadDocPage } from './upload-doc.page';

const routes: Routes = [
  {
    path: '',
    component: UploadDocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadDocPageRoutingModule {}
