import { Component } from '@angular/core';
import { Clubs } from '../clubs/clubs';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { Auth } from '../../../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-clubs-approvement',
  imports: [CommonModule, FormsModule, TranslateModule, ProfileSidebar, RouterLink],
  templateUrl: './clubs-approvement.html',
  styleUrl: './clubs-approvement.css',
})
export class ClubsApprovement {
  currentLang = 'en';
  selectedFile: File | null = null;
  searchTerm = '';
  filteredClubs: any[] = [];

  clubs: any[] = [];
  showCreateModal = false;
  newClub = {
    club_name: '',
    description: '',
    club_name_ar: '',
    description_ar: '',
    logo: '',
  };

  constructor(
    private translate: TranslateService,
    public auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.auth.getClubs().subscribe({
      next: (data) => {
        const sortedClubs = data.sort((a: any, b: any) => {
          const order: any = {
            pending: 1,
            active: 2,
            inactive: 3,
          };

          return order[a.status] - order[b.status];
        });

        this.clubs = sortedClubs;
        this.filteredClubs = sortedClubs;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  approveClub(id: number, action: string) {
    this.auth.approveClub(id, action).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err: any) => console.error(err),
    });
  }

  filterClubs() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredClubs = [...this.clubs];
      return;
    }

    this.filteredClubs = this.clubs.filter((club) => {
      const englishName = club.club_name?.toLowerCase() || '';
      const arabicName = club.club_name_ar?.toLowerCase() || '';

      return englishName.includes(term) || arabicName.includes(term);
    });
  }
}
