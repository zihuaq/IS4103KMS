import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

import { OverviewComponent } from './overview/overview.component';
import { MaterialResourceAvailableComponent } from './material-resource-available/material-resource-available.component';
import { SkillsComponent } from './skills/skills.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage, OverviewComponent, MaterialResourceAvailableComponent, SkillsComponent]
})
export class ProfilePageModule {}
