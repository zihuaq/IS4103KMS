import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
import { BasicDetailsComponent } from './user-profile/basic-details/basic-details.component';
import { ProjectsComponent } from './user-profile/projects/projects.component';
import { OverviewComponent } from './user-profile/overview/overview.component';
import { MaterialResourceAvailableComponent } from './user-profile/material-resource-available/material-resource-available.component';
import { SkillsComponent } from './user-profile/skills/skills.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileTabpanelComponent } from './user-profile/profile-tabpanel/profile-tabpanel.component';
import { ViewAllProjectComponent } from './project/view-all-project/view-all-project.component';
import { CreateNewProjectComponent } from './project/create-new-project/create-new-project.component';
import { DonateToPlatformComponent } from './donate-to-platform/donate-to-platform.component';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AppPasswordDirective } from './app-password.directive';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { EditProfileComponent } from './user-profile/edit-profile/edit-profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FollowRequestsComponent } from './notifications/follow-requests/follow-requests.component';
import { ReportProfileComponent } from './user-profile/report-profile/report-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateNewInstitutionComponent } from './create-new-institution/create-new-institution.component';
import { ProjectDetailsComponent } from './project/viewProject/project-details/project-details.component';
import { CreateNewUserSelectorComponent } from './create-new-user-selector/create-new-user-selector.component';
import { SdgInfoComponent } from './sdg-info/sdg-info.component';
import { ListFilterPipe } from './project/view-all-project/list-filter.pipe';
import { EditProjectComponent } from './project/editProject/edit-project/edit-project.component';
import { EditDetailsTabComponent } from './project/editProject/edit-details-tab/edit-details-tab.component';
import { MembersTabComponent } from './project/editProject/members-tab/members-tab.component';
import { ReportProjectComponent } from './project/viewProject/report-project/report-project.component';
import { ErrorPageComponent } from './project/viewProject/error-page/error-page.component';
import { EditHrpTabComponent } from './project/editProject/edit-hrp-tab/edit-hrp-tab.component';
import { ViewOwnProjectsComponent } from './project/view-own-projects/view-own-projects.component';
import { EditMrpTabComponent } from './project/editProject/edit-mrp-tab/edit-mrp-tab.component';
import { AffiliationRequestsComponent } from './notifications/affiliation-requests/affiliation-requests.component';
import { ViewHrpTabComponent } from './project/viewProject/view-hrp-tab/view-hrp-tab.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewsItemComponent } from './reviews/reviews-item/reviews-item.component';
import { ReviewsRecievedComponent } from './user-profile/reviews-recieved/reviews-recieved.component';
import { ReviewsWrittenComponent } from './user-profile/reviews-written/reviews-written.component';
import { AdministrationComponent } from './administration/administration.component';
import { UserSettingComponent } from './user-profile/user-setting/user-setting.component';
import { ViewMrpTabComponent } from './project/viewProject/view-mrp-tab/view-mrp-tab.component';
import { JobAppliedComponent } from './user-profile/job-applied/job-applied.component';
import { MyFulfillmentsComponent } from './project/viewProject/view-mrp-tab/my-fulfillments/my-fulfillments.component';
import { ProfileReportsComponent } from './administration/profile-reports/profile-reports.component';
import { ProjectReportsComponent } from './administration/project-reports/project-reports.component';
import { ProjectReportItemComponent } from './administration/project-reports/project-report-item/project-report-item.component';
import { ProfileReportItemComponent } from './administration/profile-reports/profile-report-item/profile-report-item.component';
import { CreateNewGroupComponent } from './group/create-new-group/create-new-group.component';
import { EditGroupDetailsTabComponent } from './group/editGroup/edit-group-details-tab/edit-group-details-tab.component';
import { EditGroupComponent } from './group/editGroup/edit-group/edit-group.component';
import { GroupMembersTabComponent } from './group/editGroup/group-members-tab/group-members-tab.component';
import { ViewAllGroupComponent } from './group/view-all-group/view-all-group.component';
import { ViewOwnGroupComponent } from './group/view-own-group/view-own-group.component';
import { GroupErrorPageComponent } from './group/viewGroup/group-error-page/group-error-page.component';
import { GroupDetailsComponent } from './group/viewGroup/group-details/group-details.component';
import { ReportGroupComponent } from './group/viewGroup/report-group/report-group.component';

import { ActivityTabComponent } from './project/viewProject/activity-tab/activity-tab.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { EditActivityTabComponent } from './project/editProject/edit-activity-tab/edit-activity-tab.component';
import { DatePipe } from '@angular/common';
import { DonateToProjectComponent } from './project/viewProject/donate-to-project/donate-to-project.component';
import { TaskTabComponent } from './project/viewProject/task-tab/task-tab.component';
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { GroupReportsComponent } from './administration/group-reports/group-reports.component';
import { PostReportsComponent } from './administration/post-reports/post-reports.component';
import { CommentReportsComponent } from './administration/comment-reports/comment-reports.component';
import { GroupReportItemComponent } from './administration/group-reports/group-report-item/group-report-item.component';
import { PostReportItemComponent } from './administration/post-reports/post-report-item/post-report-item.component';
import { CommentReportItemComponent } from './administration/comment-reports/comment-report-item/comment-report-item.component';
import { EditTaskTabComponent } from './project/editProject/edit-task-tab/edit-task-tab.component';
import { ViewDocumentsComponent } from './project/viewProject/view-documents/view-documents.component';
import { ViewSimilarProjectsComponent } from './project/viewProject/view-similar-projects/view-similar-projects.component';
import { EditDocumentsComponent } from './project/editProject/edit-documents/edit-documents.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ChatComponent } from './chat/chat.component';
import { UserFilterPipe } from './chat/user-filter.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectAwardsComponent } from './project/viewProject/project-awards/project-awards.component';
import { ReviewReportsComponent } from './administration/review-reports/review-reports.component';
import { ReviewReportItemComponent } from './administration/review-reports/review-report-item/review-report-item.component';
import { AwardsAndBadgeComponent } from './profile/awards-and-badge/awards-and-badge.component';
import { SearchProfileComponent } from './search-profile/search-profile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProfileClaimsComponent } from './administration/profile-claims/profile-claims.component';
import { ViewRecommendationsComponent } from './view-recommendations/view-recommendations.component';
import { FollowRecommendationsComponent } from './view-recommendations/follow-recommendations/follow-recommendations.component';
import { ProjectRecommendationsComponent } from './view-recommendations/project-recommendations/project-recommendations.component';
import { GroupRecommendationsComponent } from './view-recommendations/group-recommendations/group-recommendations.component';
import { ManageTagsComponent } from './admin-manage-tags/manage-tags/manage-tags.component';
import { AwardsAndBadgesComponent } from './user-profile/awards-and-badges/awards-and-badges.component';
import { HandleTagRequestsComponent } from './admin-manage-tags/handle-tag-requests/handle-tag-requests.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadProfilesComponent } from './administration/upload-profiles/upload-profiles.component';
import { AdminManageTagsComponent } from './admin-manage-tags/admin-manage-tags.component';
import { AdminManageElectionsComponent } from './admin-manage-elections/admin-manage-elections.component';

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBl7TP2OFBQJ4X2N9oRkUHTh33cK6y299c",
    authDomain: "is4103kms-4e0e3.firebaseapp.com",
    databaseURL: "https://is4103kms-4e0e3.firebaseio.com",
    projectId: "is4103kms-4e0e3",
    storageBucket: "is4103kms-4e0e3.appspot.com",
    messagingSenderId: "973751042539",
    appId: "1:973751042539:web:cdc10c50839ec3a7e319ae"
  }
};

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
    EditDetailsTabComponent,
    MembersTabComponent,
    ReportProjectComponent,
    ErrorPageComponent,
    EditHrpTabComponent,
    ViewOwnProjectsComponent,
    EditMrpTabComponent,
    AffiliationRequestsComponent,
    ReviewsComponent,
    ReviewsItemComponent,
    ReviewsRecievedComponent,
    ReviewsWrittenComponent,
    AdministrationComponent,
    UserSettingComponent,
    ViewHrpTabComponent,
    ViewMrpTabComponent,
    JobAppliedComponent,
    MyFulfillmentsComponent,
    ProfileReportsComponent,
    ProjectReportsComponent,
    ProjectReportItemComponent,
    ProfileReportItemComponent,
    CreateNewGroupComponent,
    EditGroupDetailsTabComponent,
    EditGroupComponent,
    GroupMembersTabComponent,
    ViewAllGroupComponent,
    ViewOwnGroupComponent,
    GroupErrorPageComponent,
    GroupDetailsComponent,
    ReportGroupComponent,
    ActivityTabComponent,
    EditActivityTabComponent,
    DonateToProjectComponent,
    TaskTabComponent,
    NewsfeedComponent,
    GroupReportsComponent,
    PostReportsComponent,
    CommentReportsComponent,
    GroupReportItemComponent,
    PostReportItemComponent,
    CommentReportItemComponent,
    EditTaskTabComponent,
    ViewDocumentsComponent,
    ViewSimilarProjectsComponent,
    EditDocumentsComponent,
    ChatComponent,
    UserFilterPipe,
    ProjectAwardsComponent,
    ReviewReportsComponent,
    ReviewReportItemComponent,
    AwardsAndBadgeComponent,
    SearchProfileComponent,
    UserProfileComponent,
    ProfileClaimsComponent,
    ViewRecommendationsComponent,
    FollowRecommendationsComponent,
    ProjectRecommendationsComponent,
    GroupRecommendationsComponent,
    ManageTagsComponent,
    AwardsAndBadgesComponent,
    HandleTagRequestsComponent,
    UploadProfilesComponent,
    AdminManageTagsComponent,
    AdminManageElectionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GoogleMapsModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    ModalModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, NgbModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule { }
