import { Component, HostListener, Renderer2 } from '@angular/core';
import { TranslateService } from '../../../services/translation/translation';
import { Auth } from '../../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, TranslateModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
 currentLang = 'en';
  activeLeaderboard: 'CLUBS' | 'STUDENTS' = 'CLUBS';
  user: any;
  languageSelected: string;
  showLangMenu = false;
  collapsed = false;
  showMobileLangMenu = false;

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
    private renderer: Renderer2,
  ) {
    this.authService.userProfile$.subscribe((data) => {
      this.user = data;
    });

    this.checkScreenSize();
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

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.user = user;
    });
  }

  setLeaderboardTab(tab: 'CLUBS' | 'STUDENTS') {
    this.activeLeaderboard = tab;
  }

  goToProfile() {
    this.router.navigate(['/dashboard/' + this.user.role]);
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
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

  isMobile: boolean = false;
  menuOpen: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
    if (!this.isMobile) {
      this.menuOpen = false;
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 900;
  }

  toggleLangMenu() {
    this.showLangMenu = !this.showLangMenu;
    this.showMobileLangMenu = false;
  }

  toggleMobileLangMenu() {
    this.showMobileLangMenu = !this.showMobileLangMenu;
    this.showLangMenu = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onLogout() {
    this.authService.logout();
  }
}
