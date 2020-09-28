import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './index/index.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { UserLoginPageComponent } from './user-login-page/user-login-page.component';
import { ViewAllProjectComponent } from './project/view-all-project/view-all-project.component';
import { ViewOwnProjectsComponent } from './project/view-own-projects/view-own-projects.component';
import { CreateNewProjectComponent } from './project/create-new-project/create-new-project.component';
import { DonateToPlatformComponent } from './donate-to-platform/donate-to-platform.component';

import { NotificationsComponent } from './notifications/notifications.component';
// import { ViewAllUsersComponent } from './view-all-users/view-all-users.component';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { RouteGuard } from './route-guard.service';
import { SearchUsersComponent } from './search-users/search-users.component';
import { RetrieveAllUsersComponent } from './retrieve-all-users/retrieve-all-users.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateNewInstitutionComponent } from './create-new-institution/create-new-institution.component';
import { ProjectDetailsComponent } from './project/viewProject/project-details/project-details.component';
import { CreateNewUserSelectorComponent } from './create-new-user-selector/create-new-user-selector.component';
import { SdgInfoComponent } from './sdg-info/sdg-info.component';
import { EditProjectComponent } from './project/editProject/edit-project/edit-project.component';
import { ErrorPageComponent } from './project/viewProject/error-page/error-page.component';


const routes: Routes = [
  { path: 'index', canActivate: [RouteGuard], component: IndexComponent },
  { path: 'signup', component: CreateNewUserComponent },
  { path: 'signupInstitution', component: CreateNewInstitutionComponent },
  { path: 'signupSelection', component: CreateNewUserSelectorComponent },
  { path: 'login', component: UserLoginPageComponent },
  { path: 'error', component: ErrorPageComponent },
  {
    path: 'notifications',
    canActivate: [RouteGuard],
    component: NotificationsComponent,
  },
  {
    path: 'searchUsers/affiliated/:userid',
    canActivate: [RouteGuard],
    component: SearchUsersComponent,
  },
  {
    path: 'searchUsers/followers/:userid',
    canActivate: [RouteGuard],
    component: SearchUsersComponent,
  },
  {
    path: 'searchUsers/following/:userid',
    canActivate: [RouteGuard],
    component: SearchUsersComponent,
  },
  {
    path: 'searchUsers',
    canActivate: [RouteGuard],
    component: SearchUsersComponent,
  },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  {
    path: 'profile/:userid',
    canActivate: [RouteGuard],
    component: ProfileComponent,
  },
  { path: 'profile', 
    canActivate: [RouteGuard], 
    component: ProfileComponent 
  },
  {
    path: 'accountVerification/:email/:uuid',
    component: AccountVerificationComponent,
  },
  {
    path: 'viewAllProjects',
    canActivate: [RouteGuard],
    component: ViewAllProjectComponent,
  },
  {
    path: 'viewOwnProjects/:userid',
    canActivate: [RouteGuard],
    component: ViewOwnProjectsComponent,
  },
  {
    path: 'createNewProject',
    canActivate: [RouteGuard],
    component: CreateNewProjectComponent,
  },
  {
    path: 'donateToPlatform',
    canActivate: [RouteGuard],
    component: DonateToPlatformComponent,
  },
  {
    path: 'retrieveAllUsers',
    canActivate: [RouteGuard],
    component: RetrieveAllUsersComponent,
  },
  {
    path: 'sdgInfo',
    canActivate: [RouteGuard],
    component: SdgInfoComponent,
  },
  { path: '', 
  canActivate: [RouteGuard], 
  component: IndexComponent 
  },
  { path: 'projectDetails/:projectId', 
    canActivate: [RouteGuard], 
    component: ProjectDetailsComponent 
  },
  { path: 'editProject/:projectId',
    canActivate: [RouteGuard], 
    component: EditProjectComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
