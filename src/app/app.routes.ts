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
  { path: 'dashboard/organizational-structure/:id', loadComponent: () => import('./features/dashboard/components/org-chart/org-chart').then((m) => m.OrgChart) },
  { path: 'dashboard/members/:id', loadComponent: () => import('./features/dashboard/components/members/members').then((m) => m.Members) },
  { path: 'dashboard/join-requests/:id', loadComponent: () => import('./features/dashboard/components/join-requests/join-requests').then((m) => m.JoinRequests) },
  { path: 'dashboard/club-profile/:id', loadComponent: () => import('./features/dashboard/components/club-profile/club-profile').then((m) => m.ClubProfile)},
  { path: 'dashboard/my-club-profile/:id', loadComponent: () => import('./features/dashboard/components/my-club-profile/my-club-profile').then((m) => m.MyClubProfile)},
  { path: 'dashboard/user-profile/:id', loadComponent: () => import('./features/dashboard/components/pages/user-profile/user-profile').then(m => m.UserProfile)},
  { path: 'dashboard/clubs-approvement', loadComponent: () => import('./features/dashboard/components/clubs-approvement/clubs-approvement').then((m) => m.ClubsApprovement)},
  { path: 'dashboard/staff-profile', loadComponent: () => import('./features/roles/staff/staff-dashboard/staff-dashboard').then((m) => m.StaffDashboard)},
  { path: 'dashboard/ai-analytics', loadComponent: () => import('./features/dashboard/components/ai-analytics/ai-analytics').then((m) => m.AiAnalytics)},
  { path: 'dashboard/activities-attended', loadComponent: () => import('./features/dashboard/components/activities-attended/activities-attended').then((m) => m.ActivitiesAttended)},
  { path: 'dashboard/activities/:id/participants', loadComponent: () => import('./features/dashboard/components/activity-participants/activity-participants').then((m) => m.ActivityParticipants)},
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound) }
];