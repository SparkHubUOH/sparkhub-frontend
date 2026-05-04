import { Component } from '@angular/core';
import { Clubs } from "../clubs/clubs";
import { ProfileSidebar } from "../../../roles/profile-sidebar/profile-sidebar";
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
        this.clubs = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.resetForm();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveNewClub() {
    if (!this.newClub.club_name.trim() || !this.newClub.club_name_ar.trim()) {
      alert('Please fill in the required fields');
      return;
    }
    const formData = new FormData();
    formData.append('club_name', this.newClub.club_name);
    formData.append('club_name_ar', this.newClub.club_name_ar);
    formData.append('description', this.newClub.description);
    formData.append('description_ar', this.newClub.description_ar);

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    this.auth.createClub(formData).subscribe({
      next: (response: any) => {
        alert('Club request submitted for approval!');
        this.closeCreateModal();
        this.ngOnInit();
      },
      error: (err: any) => {
        console.error('Error:', err);
        alert(err.error?.error || 'Error submitting request');
      },
    });
  }

  approveClub(id: number, action: string) {
    this.auth.approveClub(id, action).subscribe({
      next: () => {
        alert(`Club ${action}ed!`);
        this.ngOnInit();
      },
      error: (err: any) => console.error(err),
    });
  }

  resetForm() {
    this.newClub = {
      club_name: '',
      description: '',
      club_name_ar: '',
      description_ar: '',
      logo: '',
    };
  }

}
