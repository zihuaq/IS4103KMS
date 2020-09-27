import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterinstitutionPageRoutingModule } from './registerinstitution-routing.module';

import { RegisterinstitutionPage } from './registerinstitution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterinstitutionPageRoutingModule
  ],
  declarations: [RegisterinstitutionPage]
})
export class RegisterinstitutionPageModule {}
