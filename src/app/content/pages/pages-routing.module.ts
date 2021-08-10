import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/core/services/auth/auth-guard.service';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: PagesPage,
    children: [
      {
        path: '',
        //loadChildren: () => import('').then(m => m.AppointmentsPageModule)
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
