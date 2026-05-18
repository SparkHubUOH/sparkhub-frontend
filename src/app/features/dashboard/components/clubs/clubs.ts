import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { Auth } from '../../../../services/auth';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-clubs',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, Sidebar, ReactiveFormsModule, RouterLink],
  templateUrl: './clubs.html',
  styleUrls: ['./clubs.css'],
})
export class Clubs implements OnInit {
  currentLang = 'en';
  clubForm: FormGroup;
  selectedFile: File | null = null;
  clubs: any[] = [];
  searchTerm = '';
  showCreateModal = false;

  constructor(
    private translate: TranslateService,
    public auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.clubForm = this.fb.group({
      club_name: ['', [Validators.required]],
      club_name_ar: ['', [Validators.required]],
      description: ['', [Validators.required]],
      description_ar: ['', [Validators.required]],
      logo: [''],
    });
  }

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

  filteredClubs() {
    return this.clubs.filter((club) => {
      const search = this.searchTerm.toLowerCase();

      return (
        club.status === 'active' &&
        (club.club_name?.toLowerCase().includes(search) ||
          club.club_name_ar?.toLowerCase().includes(search))
      );
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
    if (this.clubForm.invalid) {
      this.clubForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('club_name', this.clubForm.get('club_name')?.value);
    formData.append('club_name_ar', this.clubForm.get('club_name_ar')?.value);
    formData.append('description', this.clubForm.get('description')?.value);
    formData.append('description_ar', this.clubForm.get('description_ar')?.value);

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    this.auth.createClub(formData).subscribe({
      next: (response: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'Club request submitted for approval!',
          icon: 'success',
          confirmButtonColor: '#28a745',
        });
        this.closeCreateModal();
        this.clubForm.reset();
        this.ngOnInit();
      },
      error: (err: any) => {
        console.error('Error:', err);
        Swal.fire({
          title: 'Error!',
          text: err.error?.error || 'Something went wrong',
          icon: 'error',
        });
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
    this.clubForm.reset();
    this.selectedFile = null;
  }
}
