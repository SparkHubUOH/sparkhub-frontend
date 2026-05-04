import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home').then((m) => m.Home) },
  { path: 'register', loadComponent: () => import('./pages/sign-up/sign-up').then((m) => m.SignUp) },
  { path: 'login', loadComponent: () => import('./pages/log-in/log-in').then((m) => m.LogIn) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/home/home').then((m) => m.Home) },
  { path: 'dashboard/clubs', loadComponent: () => import('./features/dashboard/components/clubs/clubs').then((m) => m.Clubs) },
  { path: 'dashboard/activities', loadComponent: () => import('./features/dashboard/components/activities/activities').then((m) => m.Activities) },
  { path: 'dashboard/student', loadComponent: () => import('./features/roles/student/student-dashboard/student-dashboard').then((m) => m.StudentDashboard) },
  { path: 'dashboard/leader', loadComponent: () => import('./features/roles/leader/leader-dashboard/leader-dashboard').then((m) => m.LeaderDashboard) },
  { path: 'dashboard/staff', loadComponent: () => import('./features/roles/staff/staff-dashboard/staff-dashboard').then((m) => m.StaffDashboard) },
  { path: 'dashboard/organizational-structure', loadComponent: () => import('./features/dashboard/components/org-chart/org-chart').then((m) => m.OrgChart) },
  { path: 'dashboard/members', loadComponent: () => import('./features/dashboard/components/members/members').then((m) => m.Members) },
  { path: 'dashboard/club-profile', loadComponent: () => import('./features/dashboard/components/club-profile/club-profile').then((m) => m.ClubProfile)},
  { path: 'dashboard/user-profile', loadComponent: () => import('./features/dashboard/components/pages/user-profile/user-profile').then(m => m.UserProfile)},
  { path: 'dashboard/clubs-approvement', loadComponent: () => import('./features/dashboard/components/clubs-approvement/clubs-approvement').then((m) => m.ClubsApprovement)},
  { path: 'dashboard/staff-profile', loadComponent: () => import('./features/roles/staff/staff-dashboard/staff-dashboard').then((m) => m.StaffDashboard)},
  { path: 'dashboard/ai-analytics', loadComponent: () => import('./features/dashboard/components/ai-analytics/ai-analytics').then((m) => m.AiAnalytics)},
];