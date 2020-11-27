import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchProfilesPageRoutingModule } from './search-profiles-routing.module';

import { SearchProfilesPage } from './search-profiles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchProfilesPageRoutingModule
  ],
  declarations: [SearchProfilesPage]
})
export class SearchProfilesPageModule {}
