import { Component, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '../../../services/translation/translation';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, Sidebar, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  currentLang = 'en';
  activeLeaderboard: 'CLUBS' | 'STUDENTS' = 'CLUBS';
  user: any;
  clubs: any[] = [];
  students: any[] = [];
  languageSelected: string;
  showLangMenu = false;
  showMobileLangMenu = false;

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
  ) {
    this.authService.userProfile$.subscribe((data) => {
      this.user = data;
    });

    const initialLang = localStorage.getItem('lang') || 'en';
    this.languageSelected = initialLang;
    this.translate.use(initialLang);
    this.renderer.setAttribute(
      document.documentElement,
      'dir',
      initialLang === 'ar' ? 'rtl' : 'ltr',
    );
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
    this.authService.userProfile$.subscribe((data) => {
      if (data) {
        this.user = data;
        this.cdr.detectChanges();
      }
    });

    this.authService.getWinnerClub().subscribe({
      next: (data) => {
        this.clubs = data;
        this.cdr.detectChanges();
        console.log('Clubs Data:', this.clubs);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.authService.getStudents().subscribe({
    next: (data) => {
      this.students = data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Failed to load students', err)
  });
  }

  setLeaderboardTab(tab: 'CLUBS' | 'STUDENTS') {
    this.activeLeaderboard = tab;
  }

  goToProfile() {
    if (this.user && this.user.role) {
      this.router.navigate(['/dashboard/' + this.user.role]);
    } else {
      console.error('User data not loaded yet');
    }
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);

    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  setLanguage(lang: string) {
    this.languageSelected = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
    this.showLangMenu = false;
    this.showMobileLangMenu = false;
  }

  get topClubs() {
    return this.clubs
      .filter((club) => club.points !== undefined)
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 3);
  }

  get topStudents() {
    return this.students
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 3);
  }
}
