import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './index/index.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { UserLoginPageComponent } from './user-login-page/user-login-page.component';
import { ViewAllUsersComponent } from './view-all-users/view-all-users.component';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { RouteGuard } from "./route-guard.service";

const routes: Routes = [
  { path: 'signup', component: CreateNewUserComponent },
  { path: 'login', component: UserLoginPageComponent },
  { path: 'profile/:userid', canActivate:[RouteGuard], component: ProfileComponent },
  { path: 'profile', canActivate:[RouteGuard], component: ProfileComponent },
  { path: 'viewAllUsers', canActivate:[RouteGuard], component: ViewAllUsersComponent },
  { path: 'accountVerification/:email/:uuid', component: AccountVerificationComponent },
  { path: '', component: IndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
