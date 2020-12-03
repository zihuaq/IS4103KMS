import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      )
  },
  {
    path: 'forgetpassword',
    loadChildren: () =>
      import('./pages/forgetpassword/forgetpassword.module').then(
        (m) => m.ForgetpasswordPageModule
      )
  },
  {
    path: 'userselector',
    loadChildren: () =>
      import('./pages/userselector/userselector.module').then(
        (m) => m.UserselectorPageModule
      )
  },
  {
    path: 'registerinstitution',
    loadChildren: () =>
      import('./pages/registerinstitution/registerinstitution.module').then(
        (m) => m.RegisterinstitutionPageModule
      )
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'search-users',
    loadChildren: () =>
      import('./pages/search-users/search-users.module').then(
        (m) => m.SearchUsersPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./pages/notifications/notifications.module').then(
        (m) => m.NotificationsPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'sdg-info',
    loadChildren: () =>
      import('./pages/sdg-info/sdg-info.module').then(
        (m) => m.SdgInfoPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'index',
    loadChildren: () =>
      import('./pages/index/index.module').then((m) => m.IndexPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-skills',
    loadChildren: () =>
      import('./pages/add-skills/add-skills.module').then(
        (m) => m.AddSkillsPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'view-skills',
    loadChildren: () =>
      import('./pages/view-skills/view-skills.module').then(
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
      import(
        './pages/project/create-new-project/create-new-project.module'
      ).then((m) => m.CreateNewProjectPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'project-details/:projectId/:tabName',
    loadChildren: () =>
      import(
        './pages/project/viewProject/project-details/project-details.module'
      ).then((m) => m.ProjectDetailsPageModule)
  },
  {
    path: 'edit-project-details/:projectId',
    loadChildren: () =>
      import(
        './pages/project/editProject/edit-project-details/edit-project-details.module'
      ).then((m) => m.EditProjectDetailsPageModule)
  },
  {
    path: 'tab-panel/:projectId',
    loadChildren: () =>
      import('./pages/project/editProject/tab-panel/tab-panel.module').then(
        (m) => m.TabPanelPageModule
      )
  },

  {
    path: 'edit-members',
    loadChildren: () =>
      import(
        './pages/project/editProject/edit-members/edit-members.module'
      ).then((m) => m.EditMembersPageModule)
  },
  {
    path: 'view-all-group',
    loadChildren: () =>
      import('./pages/group/view-all-group/view-all-group.module').then(
        (m) => m.ViewAllGroupPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'create-new-group',
    loadChildren: () =>
      import('./pages/group/create-new-group/create-new-group.module').then(
        (m) => m.CreateNewGroupPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: 'group-details/:groupId',
    loadChildren: () =>
      import('./pages/group/viewGroup/group-details/group-details.module').then(
        (m) => m.GroupDetailsPageModule
      )
  },
  {
    path: 'edit-group-details/:groupId',
    loadChildren: () =>
      import(
        './pages/group/editGroup/edit-group-details/edit-group-details.module'
      ).then((m) => m.EditGroupDetailsPageModule)
  },
  {
    //** */
    path: 'tab-panel/group/:groupId',
    loadChildren: () =>
      import('./pages/group/editGroup/tab-panel/tab-panel.module').then(
        (m) => m.TabPanelPageModule
      )
  },
  {
    path: 'view-own-groups',
    loadChildren: () =>
      import('./pages/group/view-own-groups/view-own-groups.module').then(
        (m) => m.ViewOwnGroupsPageModule
      )
  },
  {
    //** */
    path: 'edit-members',
    loadChildren: () =>
      import('./pages/group/editGroup/edit-members/edit-members.module').then(
        (m) => m.EditMembersPageModule
      )
  },
  {
    path: 'changepassword',
    loadChildren: () =>
      import('./pages/changepassword/changepassword.module').then(
        (m) => m.ChangepasswordPageModule
      )
  },
  {
    path: 'user-setting',
    loadChildren: () =>
      import('./pages/user-setting/user-setting.module').then(
        (m) => m.UserSettingPageModule
      )
  },
  {
    path: 'deactivate-account',
    loadChildren: () =>
      import('./pages/deactivate-account/deactivate-account.module').then(
        (m) => m.DeactivateAccountPageModule
      )
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./pages/logout/logout.module').then((m) => m.LogoutPageModule)
  },
  {
    path: 'view-own-projects',
    loadChildren: () =>
      import('./pages/project/view-own-projects/view-own-projects.module').then(
        (m) => m.ViewOwnProjectsPageModule
      )
  },
  {
    path: 'view-users',
    loadChildren: () =>
      import('./pages/view-users/view-users.module').then(
        (m) => m.ViewUsersPageModule
      )
  },
  {
    path: 'view-basic-info',
    loadChildren: () =>
      import('./pages/view-basic-info/view-basic-info.module').then(
        (m) => m.ViewBasicInfoPageModule
      )
  },
  {
    path: 'edit-basic-info',
    loadChildren: () =>
      import('./pages/edit-basic-info/edit-basic-info.module').then(
        (m) => m.EditBasicInfoPageModule
      )
  },
  {
    path: 'view-sdgs',
    loadChildren: () =>
      import('./pages/view-sdgs/view-sdgs.module').then(
        (m) => m.ViewSdgsPageModule
      )
  },
  {
    path: 'add-sdgs',
    loadChildren: () =>
      import('./pages/add-sdgs/add-sdgs.module').then(
        (m) => m.AddSdgsPageModule
      )
  },
  {
    path: 'add-material-resource-available',
    loadChildren: () =>
      import(
        './pages/add-material-resource-available/add-material-resource-available.module'
      ).then((m) => m.AddMaterialResourceAvailablePageModule)
  },
  {
    path: 'view-hrp',
    loadChildren: () =>
      import('./pages/project/viewProject/view-hrp/view-hrp.module').then(
        (m) => m.ViewHrpPageModule
      )
  },
  {
    path: 'create-post',
    loadChildren: () =>
      import('./pages/create-post/create-post.module').then(
        (m) => m.CreatePostPageModule
      )
  },
  {
    path: 'edit-post-comment-modal',
    loadChildren: () =>
      import(
        './pages/edit-post-comment-modal/edit-post-comment-modal.module'
      ).then((m) => m.EditPostCommentModalPageModule)
  },
  {
    path: 'share-post-modal',
    loadChildren: () =>
      import('./pages/share-post-modal/share-post-modal.module').then(
        (m) => m.SharePostModalPageModule
      )
  },
  {
    path: 'hrp-details/:hrpId',
    loadChildren: () =>
      import('./pages/project/viewProject/hrp-details/hrp-details.module').then(
        (m) => m.HrpDetailsPageModule
      )
  },
  {
    path: 'report-post-modal',
    loadChildren: () =>
      import('./pages/report-post-modal/report-post-modal.module').then(
        (m) => m.ReportPostModalPageModule
      )
  },
  {
    path: 'create-hrp/:projectId',
    loadChildren: () =>
      import('./pages/project/editProject/create-hrp/create-hrp.module').then(
        (m) => m.CreateHrpPageModule
      )
  },
  {
    path: 'edit-hrp-details/:hrpId',
    loadChildren: () =>
      import(
        './pages/project/editProject/edit-hrp-details/edit-hrp-details.module'
      ).then((m) => m.EditHrpDetailsPageModule)
  },
  {
    path: 'view-mrp/:mrpId',
    loadChildren: () =>
      import('./pages/project/viewProject/view-mrp/view-mrp.module').then(
        (m) => m.ViewMrpPageModule
      )
  },
  {
    path: 'edit-mrp-details/:mrpId',
    loadChildren: () =>
      import(
        './pages/project/editProject/edit-mrp-details/edit-mrp-details.module'
      ).then((m) => m.EditMrpDetailsPageModule)
  },
  {
    path: 'create-mrp/:projectId',
    loadChildren: () =>
      import('./pages/project/editProject/create-mrp/create-mrp.module').then(
        (m) => m.CreateMrpPageModule
      )
  },
  {
    path: 'report-project',
    loadChildren: () =>
      import(
        './pages/project/viewProject/report-project/report-project.module'
      ).then((m) => m.ReportProjectPageModule)
  },
  {
    path: 'mrp-details/:mrpId',
    loadChildren: () =>
      import('./pages/project/viewProject/mrp-details/mrp-details.module').then(
        (m) => m.MrpDetailsPageModule
      )
  },
  {
    path: 'fulfill-posting/:mrpId',
    loadChildren: () =>
      import(
        './pages/project/viewProject/mrp-details/fulfill-posting/fulfill-posting.module'
      ).then((m) => m.FulfillPostingPageModule)
  },
  {
    path: 'add-mra-modal',
    loadChildren: () =>
      import(
        './pages/project/viewProject/mrp-details/add-mra-modal/add-mra-modal.module'
      ).then((m) => m.AddMraModalPageModule)
  },
  {
    path: 'view-my-fulfillments/:projectId',
    loadChildren: () =>
      import(
        './pages/project/viewProject/view-mrp/view-my-fulfillments/view-my-fulfillments.module'
      ).then((m) => m.ViewMyFulfillmentsPageModule)
  },
  {
    path: 'manage-fulfillments-modal',
    loadChildren: () =>
      import(
        './pages/project/editProject/manage-fulfillments-modal/manage-fulfillments-modal.module'
      ).then((m) => m.ManageFulfillmentsModalPageModule)
  },
  {
    path: 'update-quantity-modal',
    loadChildren: () =>
      import(
        './pages/project/editProject/manage-fulfillments-modal/update-quantity-modal/update-quantity-modal.module'
      ).then((m) => m.UpdateQuantityModalPageModule)
  },
  {
    path: 'receive-resource-modal',
    loadChildren: () =>
      import(
        './pages/project/editProject/manage-fulfillments-modal/receive-resource-modal/receive-resource-modal.module'
      ).then((m) => m.ReceiveResourceModalPageModule)
  },
  {
    path: 'upload-doc/:projectId',
    loadChildren: () =>
      import('./pages/project/editProject/upload-doc/upload-doc.module').then(
        (m) => m.UploadDocPageModule
      )
  },
  {
    path: 'report-group',
    loadChildren: () =>
      import('./pages/group/viewGroup/report-group/report-group.module').then(
        (m) => m.ReportGroupPageModule
      )
  },
  {
    path: 'search-profiles',
    loadChildren: () =>
      import('./pages/search-profiles/search-profiles.module').then(
        (m) => m.SearchProfilesPageModule
      )
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./pages/user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      )
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./pages/chat/chat.module').then((m) => m.ChatPageModule)
  },
  {
    path: 'messages/:user',
    loadChildren: () =>
      import('./pages/chat/messages/messages.module').then(
        (m) => m.MessagesPageModule
      )
  },
  {
    path: 'donate-to-project-modal',
    loadChildren: () =>
      import(
        './pages/project/viewProject/donate-to-project-modal/donate-to-project-modal.module'
      ).then((m) => m.DonateToProjectModalPageModule)
  },
  {
    path: 'donate-to-platform-modal',
    loadChildren: () =>
      import(
        './pages/donate-to-platform-modal/donate-to-platform-modal.module'
      ).then((m) => m.DonateToPlatformModalPageModule)
  },
  {
    path: 'make-payment-modal',
    loadChildren: () => 
      import(
        './pages/project/editProject/manage-fulfillments-modal/make-payment-modal/make-payment-modal.module'
      ).then( m => m.MakePaymentModalPageModule)
  // },
  // {
  //   path: 'update-fulfillment-modal',
  //   loadChildren: () => 
  //     import(
  //       './pages/project/viewProject/view-mrp/update-fulfillment-modal/update-fulfillment-modal.module'
  //     ).then( m => m.UpdateFulfillmentModalPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
