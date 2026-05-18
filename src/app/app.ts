import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('sparkhubfrontend');

  constructor(
    private authService: Auth,
    private translate: TranslateService,
    private router: Router
  ) {
    this.router.events.subscribe(() => {
      const savedLang = localStorage.getItem('lang') || 'en';
      this.translate.use(savedLang);
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('access_token');

    if (token) {
      this.authService.getProfile().subscribe({
        next: (user) => {
          this.authService.setProfile(user);
          console.log('Session restored for:', user);
        },
        error: (err) => {
          console.error('Session expired or invalid token', err);
          localStorage.removeItem('access_token');
        },
      });
    }
  }
}
