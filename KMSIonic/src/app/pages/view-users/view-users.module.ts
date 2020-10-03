import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewUsersPageRoutingModule } from './view-users-routing.module';

import { ViewUsersPage } from './view-users.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewUsersPageRoutingModule
  ],
  declarations: [ViewUsersPage]
})
export class ViewUsersPageModule {}
