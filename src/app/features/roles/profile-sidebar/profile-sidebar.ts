import { Component, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '../../../services/translation/translation';
import { Auth } from '../../../services/auth';
import { TranslateModule } from '@ngx-translate/core';
import { ClubService } from '../../../services/club-service/club-service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-profile-sidebar',
  imports: [CommonModule, TranslateModule],
  templateUrl: './profile-sidebar.html',
  styleUrls: ['./profile-sidebar.css'],
})
export class ProfileSidebar {
  collapsed = false;
  language: 'en' | 'ar' = 'en';
  user: any;
  currentLang = 'en';
  languageSelected: string;
  showLangMenu = false;
  showMobileLangMenu = false;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private renderer: Renderer2,
    public authService: Auth,
    private clubService: ClubService,
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

  goToProfile() {
    if (this.user && this.user.role) {
      const rolePath = this.user.role.toLowerCase();
      this.router.navigate(['/dashboard/' + rolePath]);
    } else {
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (savedUser.role) {
        this.router.navigate(['/dashboard/' + savedUser.role.toLowerCase()]);
      } else {
        console.error('User data not loaded yet');
      }
    }
  }

  goToAttendedActivities() {
    this.router.navigate(['dashboard/activities-attended']);
  }

  goToClub() {
    this.clubService.getMyClubId().subscribe({
      next: (res) => {
        this.router.navigate(['dashboard/my-club-profile', res.id]);
        this.menuOpen = false;
      },
    });
  }

  goToClubs() {
    this.router.navigate(['/dashboard/clubs-approvement']);
  }

  goToAnalytics() {
    this.router.navigate(['/dashboard/ai-analytics']);
  }

  goToStaffProfile(): void {
    this.router.navigate(['/dashboard/staff-profile']);
  }

  goToOrganizationalStructure() {
    this.clubService.getMyClubId().subscribe({
      next: (res) => {
        if (res && res.id) {
          this.router.navigate(['/dashboard/organizational-structure', res.id]);
          this.menuOpen = false;
        } else {
          Swal.fire('Error', 'Could not fetch club ID', 'error');
        }
      },
      error: (err) => {
        console.error('Error fetching club ID for org-structure:', err);
        Swal.fire('Error', 'Failed to fetch club data', 'error');
      },
    });
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
  }

  get currentLanguageLabel(): string {
    return this.language === 'en' ? 'English' : 'Arabic';
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    this.menuOpen = false;
  }

  setLanguage(lang: string) {
    this.languageSelected = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
    this.showLangMenu = false;
    this.menuOpen = false;
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
    this.menuOpen = false;
  }

  toggleMobileLangMenu() {
    this.showMobileLangMenu = !this.showMobileLangMenu;
    this.showLangMenu = false;
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
