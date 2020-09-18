import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './index/index.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { UserLoginPageComponent } from './user-login-page/user-login-page.component';
import { ViewAllProjectComponent } from './project/view-all-project/view-all-project.component';
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

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'signup', component: CreateNewUserComponent },
  { path: 'signupInstitution', component: CreateNewInstitutionComponent },
  { path: 'login', component: UserLoginPageComponent },
  { path: 'profile/:userid', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'searchUsers', component: SearchUsersComponent },
  { path: 'retrieveAllUsers', component: RetrieveAllUsersComponent },
  { path: '', component: IndexComponent },
  
  {
    path: 'notifications',
    canActivate: [RouteGuard],
    component: NotificationsComponent,
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
  { path: 'profile', canActivate: [RouteGuard], component: ProfileComponent },
  // { path: 'viewAllUsers', canActivate:[RouteGuard], component: ViewAllUsersComponent },
  {
    path: 'accountVerification/:email/:uuid',
    component: AccountVerificationComponent,
  },
  { path: '', component: IndexComponent },
  { path: 'viewAllProjects', component: ViewAllProjectComponent},
  { path: 'createNewProject', component: CreateNewProjectComponent },
  { path: 'donateToPlatform', component: DonateToPlatformComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
