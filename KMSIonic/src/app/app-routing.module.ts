import { NgModule } from "@angular/core"
import { PreloadAllModules, RouterModule, Routes } from "@angular/router"
import { AuthGuardService } from "./services/auth-guard.service"
import { ProfileComponent } from "./profile/profile.component"
import { AccountVerificationComponent } from "./account-verification/account-verification.component"
import { RouteGuard } from "./route-guard.service"
import { LIFECYCLE_DID_ENTER } from "@ionic/core"

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/login/login.module").then((m) => m.LoginPageModule)
  },
  {
    path: "register",
    loadChildren: () =>
      import("./pages/register/register.module").then(
        (m) => m.RegisterPageModule
      )
  },
  {
    path: "forgetpassword",
    loadChildren: () =>
      import("./pages/forgetpassword/forgetpassword.module").then(
        (m) => m.ForgetpasswordPageModule
      )
  },
  {
    path: "userselector",
    loadChildren: () =>
      import("./pages/userselector/userselector.module").then(
        (m) => m.UserselectorPageModule
      )
  },
  {
    path: "registerinstitution",
    loadChildren: () =>
      import("./pages/registerinstitution/registerinstitution.module").then(
        (m) => m.RegisterinstitutionPageModule
      )
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
