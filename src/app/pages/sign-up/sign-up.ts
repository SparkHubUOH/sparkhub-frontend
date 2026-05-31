import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '../../services/translation/translation';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  currentLang = 'en';
  showPassword = false;

  private fb = inject(FormBuilder);

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
  ) {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.currentLang = savedLang;

    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);

    const direction = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
  }

  form = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(3)]],
    last_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$!]).+$/),
      ],
    ],
    phone: ['', [Validators.required, Validators.pattern(/^05\d{8}$/)]],
    university_id: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
  });

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    
    localStorage.setItem('lang', this.currentLang);
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.form.value,
      username: this.form.value.email,
    };

    this.authService.register(formData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Something went wrong');
      },
    });
  }
}
