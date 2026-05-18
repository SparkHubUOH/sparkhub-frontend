import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import {
  StaffService,
  UserSearchResult,
} from '../../../../../services/staff-service/staff-service';
import { Auth } from '../../../../../services/auth';
import { Profile } from '../../../../../services/profile/profile';
import { Sidebar } from '../../../sidebar/sidebar';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, FormsModule, Sidebar],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {
  currentLang = 'en';
  user: any = null;
  isEditing = false;
  posts: any[] = [];
  userId: string | null = null;
  baseUrl = 'http://127.0.0.1:8000';
  serverUrl = environment.apiUrl.replace('/api', '');

  showCertificateModal = false;
  showSkillModal = false;
  showPostModal = false;
  selectedPost: any = null;
  showPostDetailModal = false;
  memberClubName = '';
  certificateError = '';
  skillError = '';
  postError = '';
  isMemberOfAnyClub = false;
  userClubs: any[] = [];

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
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    this.route.params.subscribe((params) => {
      const userId = params['id'];

      if (userId) {
        this.loadPublicProfile(userId);
        this.getCertificates(userId);
        this.getSkills(userId);
        this.getPosts(userId);
      } else {
        this.loadProfile();
        this.getCertificates();
        this.getSkills();
        this.getPosts();
      }
    });

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
      this.profileData = { ...this.profileData, ...data };
      this.processClubs(data.clubs);
      this.cdr.detectChanges();
    });
  }

  loadPublicProfile(id: string) {
    this.profileService.getPublicProfile(id).subscribe((data: any) => {
      this.profileData = { ...this.profileData, ...data };
      this.processClubs(data.clubs);
      this.cdr.detectChanges();
    });
  }

  processClubs(clubs: any[]) {
    console.log('Clubs from API:', clubs);
    if (clubs && clubs.length > 0) {
      this.userClubs = clubs.map((club) => {
        let fullLogoUrl = null;
        if (club.logo) {
          const logoPath = club.logo.startsWith('/') ? club.logo : `/${club.logo}`;
          fullLogoUrl = club.logo.startsWith('http') ? club.logo : `${this.serverUrl}${logoPath}`;
        }
        return { ...club, logo: fullLogoUrl };
      });
      this.isMemberOfAnyClub = this.userClubs.length > 0;
    } else {
      this.isMemberOfAnyClub = false;
      this.userClubs = [];
    }
  }

  isOwnProfile(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return currentUser.email === this.profileData.email;
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCertificates(userId?: string) {
    const request = userId
      ? this.profileService.getCertificatesByUser(userId)
      : this.profileService.getCertificates();

    request.subscribe((data: any) => {
      this.profileData.certificates = data;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }

  getSkills(userId?: string) {
    const request = userId
      ? this.profileService.getSkillsByUser(userId)
      : this.profileService.getSkills();

    request.subscribe((data: any) => {
      this.profileData.skills = data;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });
  }

  getPosts(userId?: string) {
    const request = userId
      ? this.profileService.getPostsByUser(userId)
      : this.profileService.getStudentPosts();

    request.subscribe({
      next: (data: any) => {
        this.posts = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching posts:', err),
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

  readMore(post: any): void {
    this.selectedPost = post;
    this.showPostDetailModal = true;
    this.cdr.detectChanges();
  }

  closePostDetailModal(): void {
    this.showPostDetailModal = false;
    this.selectedPost = null;
  }

  get visiblePosts() {
    const sortedPosts = [...this.posts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return this.showAllPosts ? sortedPosts : sortedPosts.slice(0, 3);
  }

  get visibleSkills() {
    const skills = this.profileData?.skills || [];
    return this.showAllSkills ? skills : skills.slice(0, 5);
  }

  get visibleCertificates() {
    const certs = this.profileData?.certificates || [];
    return this.showAllCertificates ? certs : certs.slice(0, 3);
  }
}
