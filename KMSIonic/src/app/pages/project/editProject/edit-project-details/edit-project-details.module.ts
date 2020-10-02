import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProjectDetailsPageRoutingModule } from './edit-project-details-routing.module';

import { EditProjectDetailsPage } from './edit-project-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProjectDetailsPageRoutingModule
  ],
  declarations: [EditProjectDetailsPage]
})
export class EditProjectDetailsPageModule {}
