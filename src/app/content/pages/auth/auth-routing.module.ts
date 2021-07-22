import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  },
  {
    path: 'auth-login',
    loadChildren: () => import('./auth-login/auth-login.module').then( m => m.AuthLoginPageModule)
  },
  {
    path: '',
    redirectTo: 'auth-login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
