import { NgModule } from "@angular/core"
import { PreloadAllModules, RouterModule, Routes } from "@angular/router"

const routes: Routes = [
  {
    path: "",
    redirectTo: "index",
    pathMatch: "full"
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./pages/profile/profile.module").then((m) => m.ProfilePageModule)
  },
  {
    path: "search-users",
    loadChildren: () =>
      import("./pages/search-users/search-users.module").then(
        (m) => m.SearchUsersPageModule
      )
  },
  {
    path: "notifications",
    loadChildren: () =>
      import("./pages/notifications/notifications.module").then(
        (m) => m.NotificationsPageModule
      )
  },
  {
    path: "sdg-info",
    loadChildren: () =>
      import("./pages/sdg-info/sdg-info.module").then(
        (m) => m.SdgInfoPageModule
      )
  },
  {
    path: "index",
    loadChildren: () =>
      import("./pages/index/index.module").then((m) => m.IndexPageModule)
  },
  {
    path: 'addskills',
    loadChildren: () => import('./pages/add-skills/add-skills.module').then( m => m.AddSkillsPageModule)
  },  {
    path: 'view-skills',
    loadChildren: () => import('./pages/view-skills/view-skills.module').then( m => m.ViewSkillsPageModule)
  }


]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
