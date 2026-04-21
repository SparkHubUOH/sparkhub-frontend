import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../services/translation/translation';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Header } from '../../layout/header/header';
import { Auth } from '../../services/auth';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  imports: [CommonModule, TranslateModule, RouterLink, Header, ReactiveFormsModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn {
  currentLang = 'en';
  form: FormGroup;

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);

    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  login() {
    if (this.form.invalid) return;

    const loginData = {
      username: this.form.value.email,
      password: this.form.value.password,
    };

    console.log('Attempting login...');

    this.authService.login(loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('access_token', res.access);

        localStorage.removeItem('user');

        this.authService.getProfile().subscribe((user: any) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.authService.setUser(user);
          this.router.navigate(['/dashboard']); 
        });
      },
      error: (loginErr) => {
        console.error('Login error:', loginErr);
        alert('Invalid credentials');
      },
    });
  }
}
