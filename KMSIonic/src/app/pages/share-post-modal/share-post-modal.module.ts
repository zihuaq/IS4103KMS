import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharePostModalPageRoutingModule } from './share-post-modal-routing.module';

import { SharePostModalPage } from './share-post-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharePostModalPageRoutingModule
  ],
  declarations: [SharePostModalPage]
})
export class SharePostModalPageModule {}
