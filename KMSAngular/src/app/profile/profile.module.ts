import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { ProjectsComponent } from './projects/projects.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [ProfileComponent, BasicDetailsComponent, ProjectsComponent, OverviewComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
  ],
})
export class ProfileModule {}
