import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { TranslateService } from '../../services/translation/translation';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [TranslateModule, CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  currentLang = 'en';

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);

    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  languageSelected: string;
  showLangMenu = false;
  showMobileLangMenu = false;

  constructor(
    private translate: TranslateService,
    private renderer: Renderer2,
    private router: Router,
  ) {
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

  scrollToSection(section: string) {
    if (this.router.url === '/' || this.router.url === '/home') {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/']).then(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}
