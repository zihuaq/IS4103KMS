import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import { ModalModule } from 'ngx-bootstrap/modal';

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
import { DonateToPlatformComponent } from './donate-to-platform/donate-to-platform.component';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AppPasswordDirective } from './app-password.directive';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FollowRequestsComponent } from './notifications/follow-requests/follow-requests.component';
import { ReportProfileComponent } from './profile/report-profile/report-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateNewInstitutionComponent } from './create-new-institution/create-new-institution.component';
import { ProjectDetailsComponent } from './project/project-details/project-details.component';
import { CreateNewUserSelectorComponent } from './create-new-user-selector/create-new-user-selector.component';
import { SdgInfoComponent } from './sdg-info/sdg-info.component';
import { ListFilterPipe } from './project/view-all-project/list-filter.pipe';
import { EditProjectComponent } from './project/edit-project/edit-project.component';
import { DetailsTabComponent } from './project/details-tab/details-tab.component';
import { MembersTabComponent } from './project/members-tab/members-tab.component';
import { ReportProjectComponent } from './project/report-project/report-project.component';
 
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
    DonateToPlatformComponent,
    AccountVerificationComponent,
    LoadingSpinnerComponent,
    AppPasswordDirective,
    SearchbarComponent,
    SearchUsersComponent,
    EditProfileComponent,
    NotificationsComponent,
    FollowRequestsComponent,
    ReportProfileComponent,
    ForgotPasswordComponent,
    CreateNewInstitutionComponent,
    ProjectDetailsComponent,
    CreateNewUserSelectorComponent,
    SdgInfoComponent,
    ListFilterPipe,
    EditProjectComponent,
    DetailsTabComponent,
    MembersTabComponent,
    ReportProjectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPayPalModule,
    GoogleMapsModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
