import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { IndexComponent } from './index/index.component';
import { UserLoginPageComponent } from './user-login-page/user-login-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { BasicDetailsComponent } from './profile/basic-details/basic-details.component';
import { ProjectsComponent } from './profile/projects/projects.component';
import { OverviewComponent } from './profile/overview/overview.component';
import { MaterialResourceAvailableComponent } from './profile/material-resource-available/material-resource-available.component';
import { SkillsComponent } from './profile/skills/skills.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileTabpanelComponent } from './profile/profile-tabpanel/profile-tabpanel.component';
import { ViewAllProjectComponent } from './project/view-all-project/view-all-project.component';
import { CreateNewProjectComponent } from './project/create-new-project/create-new-project.component';
import { SearchbarComponent } from './top-navbar/searchbar/searchbar.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { DonateToPlatformComponent } from './donate-to-platform/donate-to-platform.component';


@NgModule({
  declarations: [
    AppComponent,
    CreateNewUserComponent,
    IndexComponent,
    UserLoginPageComponent,
    HeaderComponent,
    TopNavbarComponent,
    ProfileComponent,
    BasicDetailsComponent,
    ProjectsComponent,
    OverviewComponent,
    MaterialResourceAvailableComponent,
    SkillsComponent,
    SideNavbarComponent,
    FooterComponent,
    ProfileTabpanelComponent,
    ViewAllProjectComponent,
    CreateNewProjectComponent,
    SearchbarComponent,
    SearchUsersComponent,
    EditProfileComponent,
    DonateToPlatformComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPayPalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
