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
import { UserProfile } from '../../../dashboard/components/pages/user-profile/user-profile';
import { ProfileSidebar } from '../../profile-sidebar/profile-sidebar';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, FormsModule, UserProfile, ProfileSidebar],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  currentLang = 'en';
  user: any = null;
  isEditing = false;
  posts: any[] = [];

  showCertificateModal = false;
  showSkillModal = false;
  showPostModal = false;
  selectedPost: any = null;
  showPostDetailModal = false;
  certificateError = '';
  skillError = '';
  postError = '';

  certificateForm = {
    name: '',
    date: '',
  };

  skillForm = {
    name: '',
  };

  postForm = {
    content: '',
    image: null as File | null,
    imagePreview: '',
  };

  profileData: any = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    points: 0,
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

  showAllPosts = false;
  showAllSkills = false;
  showAllCertificates = false;

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

    this.authService.getProfile().subscribe({
      next: (data) => {
        this.user = data;
        this.profileData = data;

        this.getCertificates();
        this.getSkills();
        this.getPosts();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching profile:', err),
    });
  }

  goBack() {
    window.history.back();
  }

  loadProfile() {
    this.authService.getProfile().subscribe({
      next: (data: any) => {
        this.profileData = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  isOwnProfile(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return currentUser.email === this.profileData.email;
  }

  isMyProfile(): boolean {
    return this.user?.id === this.profileData?.id;
  }

  get isOwner(): boolean {
    const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
    return loggedInUser.email === this.profileData.email;
  }

  toggleEdit() {
    if (this.isEditing) {
      this.saveProfile();
    } else {
      this.isEditing = true;
    }
  }

  saveProfile() {
    const updatedData = {
      first_name: this.profileData.first_name,
      last_name: this.profileData.last_name,
      phone: this.profileData.phone,
      bio: this.profileData.bio,
      email: this.profileData.email,
    };

    this.profileService.updateProfile(updatedData).subscribe({
      next: (res) => {
        this.isEditing = false;
        this.profileData = { ...this.profileData, ...res, bio: updatedData.bio };

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem(
          'user',
          JSON.stringify({ ...user, ...updatedData, username: updatedData.email }),
        );

        this.loadProfile();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update error:', err);
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
    this.cdr.detectChanges();
  }

  closeCertificateModal() {
    this.showCertificateModal = false;
    this.certificateForm = { name: '', date: '' };
    this.certificateError = '';
    this.cdr.detectChanges();
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
      this.loadProfile();
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
      this.loadProfile();
      this.closeSkillModal();
      this.cdr.detectChanges();
    });
  }

  openPostModal() {
    this.showPostModal = true;
  }
  closePostModal() {
    this.showPostModal = false;
    this.postForm = { content: '', image: null, imagePreview: '' };
    this.postError = '';
  }
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.postForm.image = file;
      const reader = new FileReader();
      reader.onload = () => (this.postForm.imagePreview = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
  submitPost() {
    if (!this.postForm.content.trim()) {
      this.postError = 'Post content is required.';
      return;
    }
    const formData = new FormData();
    formData.append('content', this.postForm.content);
    if (this.postForm.image) formData.append('image', this.postForm.image);

    this.profileService.addPost(formData).subscribe({
      next: (newPost: any) => {
        this.posts.unshift(newPost);
        this.loadProfile();
        this.closePostModal();

        this.postForm = {
          content: '',
          image: null,
          imagePreview: '',
        };
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.postError = 'Failed to publish post. Please try again.';
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.postForm.image = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.postForm.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  shareProfile() {
    const profileUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Profile',
        text: 'Check out this student profile',
        url: profileUrl,
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      Swal.fire({
        title: 'Copied!',
        text: 'Profile link copied to clipboard.',
        icon: 'success',
        confirmButtonColor: '#1e3a5f',
      });
    }
  }

  readMore(post: any): void {
    this.selectedPost = post;
    this.showPostDetailModal = true;
    this.cdr.detectChanges();
  }

  closePostDetailModal(): void {
    this.showPostDetailModal = false;
    this.selectedPost = null;
  }

  getPosts() {
    this.profileService.getStudentPosts().subscribe({
      next: (data: any) => {
        this.posts = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching posts:', err),
    });
  }

  get visiblePosts() {
    return this.showAllPosts ? this.posts : this.posts.slice(0, 3);
  }

  get visibleSkills() {
    return this.showAllSkills ? this.skillForm : this.skillForm;
  }

  get visibleCertificates() {
    return this.showAllCertificates ? this.certificateForm : this.certificateForm;
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
