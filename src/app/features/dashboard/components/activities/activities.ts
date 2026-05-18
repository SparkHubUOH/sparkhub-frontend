import { ChangeDetectorRef, Component, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../../services/auth';
import { Sidebar } from '../../sidebar/sidebar';
import { ClubService } from '../../../../services/club-service/club-service';
import { ActivitiesService } from '../../../../services/activities-service/activities-service';
import { Pipe, PipeTransform } from '@angular/core';
import Swal from 'sweetalert2';

@Pipe({
  name: 'categoryFilter',
  standalone: true,
})
export class CategoryFilterPipe implements PipeTransform {
  transform(activities: any[], category: string): any[] {
    if (!activities) return [];
    return category === 'ALL' ? activities : activities.filter((a) => a.category === category);
  }
}

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, Sidebar, CategoryFilterPipe],
  templateUrl: './activities.html',
  styleUrl: './activities.css',
})
export class Activities {
  currentLang = 'en';
  languageSelected: string;
  selectedCategory = 'ALL';
  activeLeaderboard: 'CLUBS' | 'STUDENTS' = 'CLUBS';
  monthlyActivities = 0;
  totalActivities = 0;
  totalAttendees = 0;
  user: any;
  showLangMenu = false;
  showMobileLangMenu = false;
  imageError = false;

  categories = [
    { key: 'ALL', labelKey: 'ACTIVITIES_PAGE.FILTER_ALL' },
    { key: 'WORKSHOPS', labelKey: 'ACTIVITIES_PAGE.FILTER_WORKSHOPS' },
    { key: 'DISCUSSIONS', labelKey: 'ACTIVITIES_PAGE.FILTER_DISCUSSIONS' },
    { key: 'EXHIBITIONS', labelKey: 'ACTIVITIES_PAGE.FILTER_EXHIBITIONS' },
    { key: 'OTHER', labelKey: 'ACTIVITIES_PAGE.FILTER_OTHERS' },
  ];

  activities: any[] = [];
  isRegistering = false;
  selectedActivity: any;

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
    private renderer: Renderer2,
    private clubService: ClubService,
    private cdr: ChangeDetectorRef,
    private activitiesService: ActivitiesService,
  ) {
    this.authService.userProfile$.subscribe((data) => {
      this.user = data;
    });
    const initialLang = localStorage.getItem('lang') || 'en';
    this.languageSelected = initialLang;
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    this.clubService.getAllActivities().subscribe((data) => {
      this.activities = data.slice().sort((a, b) => {
        const d1 = new Date(b.date || b.createdAt).getTime();
        const d2 = new Date(a.date || a.createdAt).getTime();
        return d1 - d2;
      });
      console.log('Activities: ' + this.activities);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      this.totalActivities = data.length;

      this.monthlyActivities = data.filter((a) => {
        const date = new Date(a.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;

      this.totalAttendees = this.activities.reduce(
        (sum, a) => sum + (a.participants_count ?? 0),
        0,
      );

      this.cdr.detectChanges();
    });
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  register(activityId: number) {
    if (this.isRegistering) return;

    this.isRegistering = true;
    this.activitiesService.registerForActivity(activityId).subscribe({
      next: (res) => {
        this.isRegistering = false;
        Swal.fire({
          title: 'Done!',
          text: 'You have been registered. Check "Activities Attended" page.',
          icon: 'success',
          confirmButtonColor: '#1e3a5f',
        });
        if (this.selectedActivity) this.close();
      },
      error: (err) => {
        this.isRegistering = false;
        Swal.fire('Wait', err.error?.message || 'Error occurred', 'warning');
      },
    });
  }

  close() {
    throw new Error('Method not implemented.');
  }

  getCategoryKey(category: string): string {
    return `${category}`;
  }

  isPast(activity: any) {
    const now = new Date();
    return new Date(activity.date) < now;
  }
}
