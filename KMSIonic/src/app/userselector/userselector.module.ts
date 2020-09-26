import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserselectorPageRoutingModule } from './userselector-routing.module';

import { UserselectorPage } from './userselector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserselectorPageRoutingModule
  ],
  declarations: [UserselectorPage]
})
export class UserselectorPageModule {}
