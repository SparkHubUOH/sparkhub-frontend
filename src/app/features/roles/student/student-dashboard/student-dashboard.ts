import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Auth } from '../../../../services/auth';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../../../services/profile/profile';
import { StaffService, UserSearchResult } from '../../../../services/staff-service/staff-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, FormsModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  currentLang = 'en';
  user: any = null;
  isEditing = false;
  showCertificateModal = false;
  showSkillModal = false;

  certificateForm = {
    name: '',
    date: '',
  };

  skillForm = {
    name: '',
  };

  certificateError = '';
  skillError = '';

  profileData: any = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    certificates: [],
    skills: [],
  };

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordMessage = '';
  passwordError = '';
  isChangingPassword = false;

  searchUniversityId = '';
  foundUser: UserSearchResult | null = null;
  userSearchError = '';
  isSearching = false;
  isPromoting = false;
  promoteMessage = '';

  activeSection = 'password';

  constructor(
    public authService: Auth,
    private translate: TranslateService,
    private http: HttpClient,
    private profileService: Profile,
    private cdr: ChangeDetectorRef,
    private staffService: StaffService,
  ) {}

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    this.loadProfile();
    this.getCertificates();
    this.getSkills();

    this.authService.getProfile().subscribe(
      (data) => {
        this.user = data;
        this.authService.setProfile(data);
        this.cdr.detectChanges();
      },
      (error) => console.error('Error fetching profile:', error),
    );
  }

  goBack() {
    window.history.back();
  }

  loadProfile() {
    this.authService.getProfile().subscribe((data: any) => {
      this.profileData = data;
      this.cdr.detectChanges();
    });
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveProfile();
    }
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    const updatedData = {
    first_name: this.profileData.first_name,
    last_name: this.profileData.last_name,
    phone: this.profileData.phone,
    bio: this.profileData.bio,
    email: this.profileData.email
  };

    this.profileService.updateProfile(updatedData).subscribe({
      next: (res) => {
        this.profileData = { ...this.profileData, ...res };
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData, username: updatedData.email }));
        this.isEditing = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCertificates() {
    this.profileService.getCertificates().subscribe((data: any) => {
      this.profileData.certificates = data;
      this.cdr.detectChanges();
    });
  }

  deleteCertificate(id: number) {
    this.profileService.deleteCertificate(id).subscribe(() => {
      this.getCertificates();
      this.cdr.detectChanges();
    });
  }

  getSkills() {
    this.profileService.getSkills().subscribe((data: any) => {
      this.profileData.skills = data;
      this.cdr.detectChanges();
    });
  }

  deleteSkill(id: number) {
    this.profileService.deleteSkill(id).subscribe(() => {
      this.getSkills();
      this.cdr.detectChanges();
    });
  }

  openCertificateModal() {
    this.certificateForm = { name: '', date: '' };
    this.certificateError = '';
    this.showCertificateModal = true;
  }

  closeCertificateModal() {
    this.showCertificateModal = false;
    this.certificateForm = { name: '', date: '' };
    this.certificateError = '';
  }

  submitCertificate() {
    if (!this.certificateForm.name || !this.certificateForm.date) {
      this.certificateError = 'Please enter a certificate name and date.';
      return;
    }

    const newCert = {
      name: this.certificateForm.name,
      date: this.certificateForm.date,
      id: '',
    };

    this.profileService.addCertificate(newCert).subscribe(() => {
      this.getCertificates();
      this.closeCertificateModal();
      this.cdr.detectChanges();
    });
  }

  openSkillModal() {
    this.skillForm = { name: '' };
    this.skillError = '';
    this.showSkillModal = true;
  }

  closeSkillModal() {
    this.showSkillModal = false;
    this.skillForm = { name: '' };
    this.skillError = '';
  }

  submitSkill() {
    if (!this.skillForm.name) {
      this.skillError = 'Please enter a skill name.';
      return;
    }

    this.profileService.addSkill({ name: this.skillForm.name }).subscribe(() => {
      this.getSkills();
      this.closeSkillModal();
      this.cdr.detectChanges();
    });
  }

  onChangePassword(): void {
    this.passwordMessage = '';
    this.passwordError = '';
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'All fields are required';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'New passwords do not match';
      return;
    }
    if (this.newPassword.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      return;
    }
    this.isChangingPassword = true;
    this.staffService
      .changePassword({
        current_password: this.currentPassword,
        new_password: this.newPassword,
        confirm_password: this.confirmPassword,
      })
      .subscribe({
        next: (response: { message: string }) => {
          Swal.fire({
            title: 'Success!',
            text: response.message || 'Password changed successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            this.authService.logout();
          });
          this.passwordMessage = response.message;
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.isChangingPassword = false;
        },
        error: (error: { error: { error: string } }) => {
          this.passwordError = error.error?.error || 'Failed to change password';
          this.isChangingPassword = false;
        },
      });
  }

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? '' : section;
  }

  onSearchUser(): void {
    this.foundUser = null;
    this.userSearchError = '';
    this.promoteMessage = '';
    if (!this.searchUniversityId.trim()) {
      this.userSearchError = 'Please enter a University ID';
      return;
    }
    this.isSearching = true;
    this.staffService.searchUserByUniversityId(this.searchUniversityId).subscribe({
      next: (user: any) => {
        this.foundUser = user;
        this.cdr.detectChanges();
        this.isSearching = false;
      },
      error: (error: { error: { error: string } }) => {
        this.userSearchError = error.error?.error || 'User not found';
        this.isSearching = false;
      },
    });
  }
  onPromoteUser(): void {
    if (!this.foundUser) return;
    this.isPromoting = true;
    this.promoteMessage = '';
    this.staffService.promoteToLeader(this.foundUser.id).subscribe({
      next: (response: { message: string }) => {
        this.promoteMessage = response.message;
        this.cdr.detectChanges();
        this.foundUser!.role = 'leader';
        this.isPromoting = false;
      },
      error: (error: { error: { error: string } }) => {
        this.userSearchError = error.error?.error || 'Failed to promote user';
        this.isPromoting = false;
      },
    });
  }
  clearSearch(): void {
    this.searchUniversityId = '';
    this.foundUser = null;
    this.userSearchError = '';
    this.promoteMessage = '';
  }
}
