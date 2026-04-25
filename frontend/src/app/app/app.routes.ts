import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'leads', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'leads',
    canActivate: [authGuard],
    loadComponent: () => import('../pages/leads/leads.component').then(m => m.LeadsComponent)
  },
  {
    path: 'leads/:id',
    canActivate: [authGuard],
    loadComponent: () => import('../pages/lead-detail/lead-detail.component').then(m => m.LeadDetailComponent)
  },
  { path: '**', redirectTo: 'leads' }
];