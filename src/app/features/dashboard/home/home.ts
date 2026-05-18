import { Component, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '../../../services/translation/translation';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { Sidebar } from '../sidebar/sidebar';
import { Profile } from '../../../services/profile/profile';
import { ActivitiesService } from '../../../services/activities-service/activities-service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, Sidebar, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  currentLang = 'en';
  activeLeaderboard: 'CLUBS' | 'STUDENTS' = 'CLUBS';

  user: any;
  clubs: any[] = [];
  activities: any[] = [];
  students: any[] = [];
  searchTerm = '';
  searchResults: any[] = [];

  languageSelected: string;
  showLangMenu = false;
  imageError = false;
  showMobileLangMenu = false;
  selectedActivity: any = null;
  profileData: any = null;

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private profileService: Profile,
    private activitiesService: ActivitiesService,
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

    const userId = this.route.snapshot.paramMap.get('id');
    const savedUser = localStorage.getItem('user');
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      this.onSearch();
    });

    if (userId) {
      this.loadPublicProfile(userId);
    } else {
      this.loadProfile();
    }
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
        this.clubs = data.filter((club: any) => club.status === 'active');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.authService.getActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.cdr.detectChanges();
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
      error: (err) => console.error('Failed to load students', err),
    });
  }

  onSearch() {
    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      this.searchResults = [];
      return;
    }

    const clubResults = this.clubs
      .filter(
        (club: any) =>
          club.club_name?.toLowerCase().includes(search) ||
          club.club_name_ar?.toLowerCase().includes(search),
      )
      .map((club: any) => ({
        type: 'Club',
        name: this.currentLang === 'ar' ? club.club_name_ar : club.club_name,
        description: this.currentLang === 'ar' ? club.description_ar : club.description,
        id: club.id,
        route: '/dashboard/club-profile',
      }));

    const studentResults = this.students
      .filter((student: any) =>
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(search),
      )
      .map((student: any) => ({
        type: this.currentLang === 'ar' ? 'طالب' : 'Student',
        name: `${student.first_name} ${student.last_name}`,
        description: student.bio,
        id: student.id,
        route: '/dashboard/user-profile',
      }));

    const activityResults = this.activities
      .filter(
        (activity: any) =>
          activity.title?.toLowerCase().includes(search) ||
          activity.title_ar?.toLowerCase().includes(search),
      )
      .map((activity: any) => ({
        type: 'Activity',
        name: this.currentLang === 'ar' ? activity.title_ar : activity.title,
        description: activity.location,
        id: activity.id,
        route: '/dashboard/activities',
      }));

    this.searchResults = [...clubResults, ...studentResults, ...activityResults];
  }

  goToSearchResult(result: any) {
    this.searchResults = [];
    this.searchTerm = '';

    if (result.type === 'Activity') {
      this.router.navigate([result.route]);
      return;
    }

    this.router.navigate([result.route, result.id]);
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        this.profileData = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading own profile:', err),
    });
  }

  loadPublicProfile(id: string) {
    this.profileService.getPublicProfile(id).subscribe((data) => {
      this.profileData = data;
    });
  }

  setLeaderboardTab(tab: 'CLUBS' | 'STUDENTS') {
    this.activeLeaderboard = tab;
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

  openActivity(activity: any) {
    this.selectedActivity = activity;
  }

  close() {
    this.selectedActivity = null;
  }

  get topClubs() {
    return this.clubs
      .filter((club: any) => club.status === 'active')
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 3);
  }

  get topStudents() {
    return this.students.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 3);
  }

  get activitiesSorted() {
    return this.activities
      .slice()
      .sort((a, b) => {
        const d1 = new Date(b.date || b.createdAt).getTime();
        const d2 = new Date(a.date || a.createdAt).getTime();
        return d1 - d2;
      })
      .slice(0, 3);
  }

  register(activityId: number) {
    this.activitiesService.registerForActivity(activityId).subscribe({
      next: (res) => {
        Swal.fire('Success!', res.message, 'success');
        this.close();
      },
      error: (err) => {
        const msg = err.error?.message || err.error?.error || 'Something went wrong';
        Swal.fire('Note', msg, 'info');
      },
    });
  }

  isPast(selectedActivity: any) {
    const now = new Date();
    return new Date(selectedActivity.date) < now;
  }
}
