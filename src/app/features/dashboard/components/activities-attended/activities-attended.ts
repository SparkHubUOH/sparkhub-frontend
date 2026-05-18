import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../../../../services/activities-service/activities-service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StudentDashboard } from '../../../roles/student/student-dashboard/student-dashboard';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { RouterLink } from '@angular/router';

interface Activity {
  id: number;
  title: string;
  title_ar?: string;
  description: string;
  description_ar?: string;
  date: string;
  location: string;
  host?: string;
  max_attendees?: number;
  category?: string;
  image?: string;
}

@Component({
  selector: 'app-activities-attended',
  imports: [CommonModule, TranslateModule, StudentDashboard, ProfileSidebar, RouterLink],
  templateUrl: './activities-attended.html',
  styleUrl: './activities-attended.css',
})
export class ActivitiesAttended implements OnInit {
  activities: any[] = [];
  upcoming: number = 0;
  past: number = 0;
  currentLang = localStorage.getItem('lang') || 'en';

  constructor(
    private activitiesService: ActivitiesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadActivities();
    this.cdr.detectChanges();
  }

  loadActivities() {
    this.activitiesService.getRegisteredActivities().subscribe({
      next: (res: any[]) => {
        this.activities = res.map((activity) => ({
          ...activity,
          category: activity.category || this.deriveCategory(activity.title),
        }));
        this.calculateStats();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading attended activities', err),
    });
  }

  calculateStats() {
    const now = new Date();
    this.upcoming = this.activities.filter((a) => new Date(a.date) >= now).length;
    this.past = this.activities.filter((a) => new Date(a.date) < now).length;
  }

  getCategoryKey(category: string): string {
    return `${category}`;
  }

  deriveCategory(title: string): string {
    const lower = title.toLowerCase();

    if (lower.includes('workshop')) return 'Workshop';
    if (lower.includes('discussion')) return 'Discussion';
    if (lower.includes('hackathon')) return 'Hackathon';
    if (lower.includes('exhibition')) return 'Exhibition';

    return 'Event';
  }
}
