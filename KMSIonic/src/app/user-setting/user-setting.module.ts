import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSettingPageRoutingModule } from './user-setting-routing.module';

import { UserSettingPage } from './user-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSettingPageRoutingModule
  ],
  declarations: [UserSettingPage]
})
export class UserSettingPageModule {}
