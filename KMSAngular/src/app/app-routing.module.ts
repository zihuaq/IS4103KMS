import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { IndexComponent } from './index/index.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { UserLoginPageComponent } from './user-login-page/user-login-page.component';
import { ViewAllProjectComponent } from './project/view-all-project/view-all-project.component';
import { SearchUsersComponent } from './search-users/search-users.component';


const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'signup', component: CreateNewUserComponent },
  { path: 'login', component: UserLoginPageComponent },
  { path: 'profile/:userid', component: ProfileComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'searchUsers', component: SearchUsersComponent },
  { path: '', component: IndexComponent },
  { path: 'viewAllProjects', component: ViewAllProjectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
