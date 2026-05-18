import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../sidebar/sidebar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClubService } from '../../../../services/club-service/club-service';
import { ActivitiesService } from '../../../../services/activities-service/activities-service';
import { TranslateService } from '../../../../services/translation/translation';
import { TranslateModule } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { StaffService } from '../../../../services/staff-service/staff-service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-club-profile',
  standalone: true,
  imports: [CommonModule, Sidebar, TranslateModule, RouterLink],
  templateUrl: './club-profile.html',
  styleUrl: './club-profile.css',
})
export class ClubProfile implements OnInit {
  currentLang = 'en';
  clubId!: number;
  serverUrl = environment.apiUrl.replace('/api', '');
  club: any;
  posts: any[] = [];
  events: any[] = [];

  selectedPost: any = null;
  showPostDetailModal = false;
  isJoined: boolean = false;
  isLeader: boolean = false;
  showAllPosts: boolean = false;
  showAllEvents: boolean = false;
  selectedActivity: any = null;
  isNotified = false;
  isMenuOpen = false;
  imageError = false;
  loggedInUserId = 0;

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private cdr: ChangeDetectorRef,
    private activitiesService: ActivitiesService,
    private translate: TranslateService,
    private staffService: StaffService,
  ) {}

  ngOnInit(): void {
    this.clubId = Number(this.route.snapshot.paramMap.get('id'));
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.loggedInUserId = user.id;

    this.getClubDetails();
    this.getClubPosts();
    this.getClubActivities();
    this.checkJoinStatus();
  }

  getClubDetails() {
    this.clubService.getClubById(this.clubId).subscribe((data) => {
      this.club = data;
      console.log('Club:', this.club);

      if (this.club.logo) {
        const logoPath = this.club.logo.startsWith('/') ? this.club.logo : `/${this.club.logo}`;
        this.club.logo = this.club.logo.startsWith('http')
          ? this.club.logo
          : `${this.serverUrl}${logoPath}`;
      }

      this.imageError = false;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.isJoined = data.is_member_requested || false;
      }, 0);
    });
  }

  getClubPosts() {
    this.clubService.getPostsByClub(this.clubId).subscribe((data) => {
      this.posts = data;
      this.cdr.detectChanges();
    });
  }

  getClubActivities() {
    this.clubService.getActivitiesByClub(this.clubId).subscribe((data) => {
      this.events = data;
      this.cdr.detectChanges();
    });
  }

  checkJoinStatus() {
    this.staffService.getClubMembers(this.clubId).subscribe({
      next: (members) => {
        const existing = members.find((m: any) => m.user.id === this.loggedInUserId);

        if (existing) {
          this.isJoined = existing.status !== 'rejected';
        }
      },
    });
  }

  get visiblePosts() {
    return this.showAllPosts ? this.posts : this.posts.slice(0, 3);
  }

  get visibleEvents() {
    return this.showAllEvents ? this.events : this.events.slice(0, 4);
  }

  registerEvent(event: any) {
    this.clubService.registerInActivity(event.id).subscribe({
      next: () => alert('Registered successfully!'),
      error: (err: { error: { error: any } }) => alert(err.error.error || 'Registration failed'),
    });
  }

  requestToJoin() {
    this.clubService.joinClub(this.clubId).subscribe({
      next: (res: any) => {
        this.isJoined = true;

        Swal.fire({
          title: 'Request Sent!',
          text: res.message || 'Your request is pending approval.',
          icon: 'success',
          confirmButtonColor: '#1e3a5f',
        });
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Note',
          text: err.error?.message || 'Something went wrong.',
          icon: 'info',
        });
      },
    });
  }

  toggleJoin(): void {
    this.isJoined = !this.isJoined;
    this.isMenuOpen = false;
  }

  toggleNotify(): void {
    this.isNotified = !this.isNotified;
    this.isMenuOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goBack(): void {
    window.history.back();
  }

  readMore(post: any): void {
    this.selectedPost = post;
    this.showPostDetailModal = true;
    this.cdr.detectChanges();
  }

  toggleLike(post: any): void {
    post.liked = !post.liked;
  }

  copyPostLink(post: any): void {
    const link = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(link);
    alert('Post link copied');
  }

  viewEvent(event: any): void {
    alert(event.title);
  }

  openActivity(activity: any) {
    this.selectedActivity = activity;
  }

  closePostDetailModal(): void {
    this.showPostDetailModal = false;
    this.selectedPost = null;
  }

  register(activityId: number) {
    this.activitiesService.registerForActivity(activityId).subscribe({
      next: (res) => {
        Swal.fire('Success!', res.message, 'success');
        this.close();
      },
      error: (err) => {
        const msg = err.error?.message || err.error?.error || 'Something went wrong';
        Swal.fire('Note', msg, 'info');
      },
    });
  }

  isPast(selectedActivity: any) {
    const now = new Date();
    return new Date(selectedActivity.date) < now;
  }

  close() {
    this.selectedActivity = null;
  }
}
