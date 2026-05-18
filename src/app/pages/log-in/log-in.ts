import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '../../services/translation/translation';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {
  currentLang = 'en';
  languageSelected: string;

  form;

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
    private fb: FormBuilder,
  ) {
    const initialLang = localStorage.getItem('lang') || 'en';
    this.currentLang = initialLang;
    this.languageSelected = initialLang;

    this.translate.setDefaultLang(initialLang);
    this.translate.use(initialLang);

    document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);

    localStorage.setItem('lang', this.currentLang);
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const loginData = {
      username: this.form.value.email,
      password: this.form.value.password,
    };

    this.authService.login(loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('access_token', res.access);

        this.authService.getProfile().subscribe((user: any) => {
          console.log('PROFILE DATA', user);
          localStorage.setItem(
            'user',
            JSON.stringify({
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              role: user.role,
            }),
          );
          this.router.navigate(['/dashboard']);
        });
      },

      error: () => {
        this.form.setErrors({ invalid: true });
      },
    });
  }
}
