import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './index/index.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { UserLoginPageComponent } from './user-login-page/user-login-page.component';
import { NotificationsComponent } from './notifications/notifications.component';
// import { ViewAllUsersComponent } from './view-all-users/view-all-users.component';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { RouteGuard } from './route-guard.service';
import { SearchUsersComponent } from './search-users/search-users.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'signup', component: CreateNewUserComponent },
  { path: 'login', component: UserLoginPageComponent },
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
  {
    path: 'accountVerification/:email/:uuid',
    component: AccountVerificationComponent,
  },
  { path: '', component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
