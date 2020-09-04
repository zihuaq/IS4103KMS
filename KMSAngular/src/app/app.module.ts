import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { IndexComponent } from './index/index.component';
import { UserLoginPageComponent } from './user-login-page/user-login-page.component';
import { ViewAllUsersComponent } from './view-all-users/view-all-users.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';


const appRoutes: Routes = [
  { path: '', component: IndexComponent},
  { path: 'signup', component: CreateNewUserComponent},
  { path: 'login', component: UserLoginPageComponent} 
]

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    CreateNewUserComponent,
    IndexComponent,
    UserLoginPageComponent,
    ViewAllUsersComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
