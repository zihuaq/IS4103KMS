import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSkillsPageRoutingModule } from './view-skills-routing.module';

import { ViewSkillsPage } from './view-skills.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewSkillsPageRoutingModule
  ],
  declarations: [ViewSkillsPage]
})
export class ViewSkillsPageModule {}
