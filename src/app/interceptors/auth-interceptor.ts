import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  console.log('Sending Token:', token);

  const isAuthRequest = req.url.includes('/api/login') || req.url.includes('/api/register');
  console.log('Token:', token);
  if (token && !isAuthRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Interceptor added token to:', req.url);
  }

  return next(req);
};