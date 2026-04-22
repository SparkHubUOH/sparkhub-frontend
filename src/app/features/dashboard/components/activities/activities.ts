import { Component, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../../services/auth';
import { Sidebar } from '../../sidebar/sidebar';
@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, Sidebar],
  templateUrl: './activities.html',
  styleUrl: './activities.css',
})
export class Activities {
  currentLang = 'en';
  languageSelected: string;
  selectedCategory = 'ALL';
  activeLeaderboard: 'CLUBS' | 'STUDENTS' = 'CLUBS';
  user: any;
  showLangMenu = false;
  showMobileLangMenu = false;

  categories = [
    { key: 'ALL', labelKey: 'ACTIVITIES_PAGE.FILTER_ALL' },
    { key: 'WORKSHOP', labelKey: 'ACTIVITIES_PAGE.FILTER_WORKSHOPS' },
    { key: 'DISCUSSION', labelKey: 'ACTIVITIES_PAGE.FILTER_DISCUSSIONS' },
    { key: 'EXHIBITION', labelKey: 'ACTIVITIES_PAGE.FILTER_EXHIBITIONS' },
  ];

  activities = [
    {
      id: '01',
      type: 'Workshop',
      titleKey: 'ACTIVITIES_PAGE.CARDS.01.TITLE',
      descriptionKey: 'ACTIVITIES_PAGE.CARDS.01.DESCRIPTION',
      dateKey: 'ACTIVITIES_PAGE.CARDS.01.DATE',
      locationKey: 'ACTIVITIES_PAGE.CARDS.01.LOCATION',
      host: 'FabLab Hub',
      seats: '24',
      tags: ['AI', 'Workshop'],
      colorClass: 'activity-blue',
    },
    {
      id: '02',
      type: 'Discussion',
      titleKey: 'ACTIVITIES_PAGE.CARDS.02.TITLE',
      descriptionKey: 'ACTIVITIES_PAGE.CARDS.02.DESCRIPTION',
      dateKey: 'ACTIVITIES_PAGE.CARDS.02.DATE',
      locationKey: 'ACTIVITIES_PAGE.CARDS.02.LOCATION',
      host: 'Campus Speaker Series',
      seats: '18',
      tags: ['Panel', 'Discussion'],
      colorClass: 'activity-purple',
    },
    {
      id: '03',
      type: 'Hackathon',
      titleKey: 'ACTIVITIES_PAGE.CARDS.03.TITLE',
      descriptionKey: 'ACTIVITIES_PAGE.CARDS.03.DESCRIPTION',
      dateKey: 'ACTIVITIES_PAGE.CARDS.03.DATE',
      locationKey: 'ACTIVITIES_PAGE.CARDS.03.LOCATION',
      host: 'University Innovation',
      seats: '40',
      tags: ['Hackathon', 'Tech'],
      colorClass: 'activity-green',
    },
    {
      id: '04',
      type: 'Exhibition',
      titleKey: 'ACTIVITIES_PAGE.CARDS.04.TITLE',
      descriptionKey: 'ACTIVITIES_PAGE.CARDS.04.DESCRIPTION',
      dateKey: 'ACTIVITIES_PAGE.CARDS.04.DATE',
      locationKey: 'ACTIVITIES_PAGE.CARDS.04.LOCATION',
      host: 'CSCE Graduates',
      seats: '30',
      tags: ['Expo', 'Projects'],
      colorClass: 'activity-orange',
    },
  ];

  constructor(
    private translate: TranslateService,
    private authService: Auth,
    private router: Router,
    private renderer: Renderer2,
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
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  get filteredActivities() {
    if (this.selectedCategory === 'ALL') {
      return this.activities;
    }

    return this.activities.filter((activity) =>
      activity.tags.some((tag) => tag.toUpperCase() === this.selectedCategory),
    );
  }

}
