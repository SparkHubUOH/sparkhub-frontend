import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentDashboard } from "../../student/student-dashboard/student-dashboard";
import { ProfileSidebar } from "../../profile-sidebar/profile-sidebar";
import { StaffService, UserSearchResult } from '../../../../services/staff-service/staff-service';
import { TranslateService } from '../../../../services/translation/translation';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-dashboard',
  imports: [StudentDashboard, ProfileSidebar, TranslateModule, FormsModule, CommonModule],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboard {
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
  constructor(
    private translate: TranslateService,
    private staffService: StaffService
  ) {}
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
    this.staffService.changePassword({
      current_password: this.currentPassword,
      new_password: this.newPassword,
      confirm_password: this.confirmPassword
    }).subscribe({
      next: (response) => {
        this.passwordMessage = response.message;
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.isChangingPassword = false;
      },
      error: (error) => {
        this.passwordError = error.error?.error || 'Failed to change password';
        this.isChangingPassword = false;
      }
    });
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
      next: (user) => {
        this.foundUser = user;
        this.isSearching = false;
      },
      error: (error) => {
        this.userSearchError = error.error?.error || 'User not found';
        this.isSearching = false;
      }
    });
  }
  onPromoteUser(): void {
    if (!this.foundUser) return;
    this.isPromoting = true;
    this.promoteMessage = '';
    this.staffService.promoteToLeader(this.foundUser.id).subscribe({
      next: (response) => {
        this.promoteMessage = response.message;
        this.foundUser!.role = 'leader';
        this.isPromoting = false;
      },
      error: (error) => {
        this.userSearchError = error.error?.error || 'Failed to promote user';
        this.isPromoting = false;
      }
    });
  }
  clearSearch(): void {
    this.searchUniversityId = '';
    this.foundUser = null;
    this.userSearchError = '';
    this.promoteMessage = '';
  }
}
