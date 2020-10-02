import { NgModule } from "@angular/core"
import { PreloadAllModules, RouterModule, Routes } from "@angular/router"
import { AuthGuard } from "./services/auth.guard"

const routes: Routes = [
  {
    path: "",
    redirectTo: "index",
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
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./pages/profile/profile.module").then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "search-users",
    loadChildren: () =>
      import("./pages/search-users/search-users.module").then(
        (m) => m.SearchUsersPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: "notifications",
    loadChildren: () =>
      import("./pages/notifications/notifications.module").then(
        (m) => m.NotificationsPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: "sdg-info",
    loadChildren: () =>
      import("./pages/sdg-info/sdg-info.module").then(
        (m) => m.SdgInfoPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: "index",
    loadChildren: () =>
      import("./pages/index/index.module").then((m) => m.IndexPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "add-skills",
    loadChildren: () =>
      import("./pages/add-skills/add-skills.module").then(
        (m) => m.AddSkillsPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: "view-skills",
    loadChildren: () =>
      import("./pages/view-skills/view-skills.module").then(
        (m) => m.ViewSkillsPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-all-project',
    loadChildren: () => 
    import('./pages/project/view-all-project/view-all-project.module').then( 
        (m) => m.ViewAllProjectPageModule
      ),
      canActivate: [AuthGuard]
  },
  {
    path: 'create-new-project',
    loadChildren: () => 
    import('./pages/project/create-new-project/create-new-project.module').then( 
      (m) => m.CreateNewProjectPageModule
    ),
    canActivate: [AuthGuard]
  },
  {
    path: 'project-details/:projectId',
    loadChildren: () => import('./pages/project/viewProject/project-details/project-details.module').then( m => m.ProjectDetailsPageModule)
  },
  {
    path: 'edit-project-details/:projectId',
    loadChildren: () => import('./pages/project/editProject/edit-project-details/edit-project-details.module').then( m => m.EditProjectDetailsPageModule)
  },
  {
    path: 'tab-panel/:projectId',
    loadChildren: () => import('./pages/project/editProject/tab-panel/tab-panel.module').then( m => m.TabPanelPageModule)
  },
  {
    path: 'edit-members',
    loadChildren: () => import('./pages/project/editProject/edit-members/edit-members.module').then( m => m.EditMembersPageModule)
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
