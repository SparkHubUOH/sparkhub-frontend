import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  console.log('GUARD RUNNING');
  const router = inject(Router);

  const token = localStorage.getItem('access_token');
  const userData = localStorage.getItem('user');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (!userData) {
    router.navigate(['/dashboard']);
    return false;
  }

  const user = JSON.parse(userData);

  const allowedRoles = route.data?.['roles'];

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('ACCESS DENIED:', user.role);

    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
