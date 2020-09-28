import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterinstitutionPage } from './registerinstitution.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterinstitutionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterinstitutionPageRoutingModule {}
