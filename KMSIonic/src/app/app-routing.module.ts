import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { AccountVerificationComponent } from './account-verification/account-verification.component';
import { RouteGuard } from './route-guard.service';
import { LIFECYCLE_DID_ENTER } from '@ionic/core';

const routes: Routes = [
  {
    path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'forgetpassword', loadChildren: './forgetpassword/forgetpassword.module#ForgetpasswordPageModule' },
  { path: 'userselector', loadChildren: './userselector/userselector.module#UserselectorPageModule' },
  { path: 'registerinstitution', loadChildren: './registerinstitution/registerinstitution.module#RegisterinstitutionPageModule' },
  {
     path: 'profile/:userid',
     canActivate: [RouteGuard],
     component: ProfileComponent,
  },
  // {
  //   path: 'accountverification',
  //   loadChildren: () => import('./accountverification/accountverification.module').then( m => m.AccountverificationPageModule)
  // },
  {
    path: 'test/accountVerification/:email/:uuid',
    component: AccountVerificationComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}


//try save