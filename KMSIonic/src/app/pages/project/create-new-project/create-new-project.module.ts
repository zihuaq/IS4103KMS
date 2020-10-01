import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewProjectPageRoutingModule } from './create-new-project-routing.module';

import { CreateNewProjectPage } from './create-new-project.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNewProjectPageRoutingModule
  ],
  declarations: [CreateNewProjectPage]
})
export class CreateNewProjectPageModule {}
