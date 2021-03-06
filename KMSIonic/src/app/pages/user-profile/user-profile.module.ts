import { PostModule } from './../../shared/post/post.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';

import { OverviewComponent } from './overview/overview.component';
import { MaterialResourceAvailableComponent } from './material-resource-available/material-resource-available.component';
import { SkillsComponent } from './skills/skills.component';
import { SDGsComponent } from './sdgs/sdgs.component';
import { ReportProfileComponent } from './report-profile/report-profile.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    PostModule
  ],
  declarations: [
    UserProfilePage,
    OverviewComponent,
    MaterialResourceAvailableComponent,
    SkillsComponent,
    SDGsComponent,
    ReportProfileComponent
  ],
  providers: [SocialSharing]
})
export class UserProfilePageModule {}
