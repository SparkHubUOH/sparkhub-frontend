import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '../../services/translation/translation';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink, Router } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Auth } from '../../services/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [TranslateModule, RouterLink, CommonModule, Header, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  currentLang = 'en';
  private fb = inject(FormBuilder);

  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', Validators.required],
    university_id: ['', Validators.required],
  });

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
  ) {
    this.translate.setDefaultLang('en');
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  register() {
    this.authService.register(this.form.value).subscribe(() => {
      console.log('User created');
    });
  }

submit() {
  if (this.form.invalid) return;

  const formData = {
    ...this.form.value,
    username: this.form.value.email
  };

  this.authService.register(formData).subscribe({
    next: () => {

      const loginData = {
        username: this.form.value.email,
        password: this.form.value.password
      };

      this.authService.login(loginData).subscribe((res: any) => {

        localStorage.setItem('access_token', res.access);

        this.authService.getProfile().subscribe((user: any) => {

          this.router.navigate(['/dashboard/']);

        });

      });

    },
    error: (err) => {
      console.error(err);
      alert('Something went wrong');
    },
  });
}
}
