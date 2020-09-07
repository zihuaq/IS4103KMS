import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
  declarations: [ProfileComponent, BasicDetailsComponent, ProjectsComponent],
  imports: [CommonModule],
})
export class ProfileModule {}
