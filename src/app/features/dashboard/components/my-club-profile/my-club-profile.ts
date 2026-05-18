import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClubService } from '../../../../services/club-service/club-service';
import { ActivitiesService } from '../../../../services/activities-service/activities-service';
import { TranslateService } from '../../../../services/translation/translation';
import Swal from 'sweetalert2';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-club-profile',
  imports: [CommonModule, TranslateModule, ProfileSidebar, FormsModule, RouterLink],
  templateUrl: './my-club-profile.html',
  styleUrl: './my-club-profile.css',
})
export class MyClubProfile implements OnInit {
  currentLang = 'en';
  clubId!: number;
  club: any;
  posts: any[] = [];
  events: any[] = [];

  isJoined: boolean = false;
  isLeader: boolean = false;
  showAllPosts: boolean = false;
  showAllEvents: boolean = false;
  showPostDetailModal = false;
  selectedActivity: any = null;
  selectedPost: any = null;

  isNotified = false;
  isMenuOpen = false;
  imageError = false;
  showEditClubModal = false;
  showCreatePostModal = false;
  showCreateEventModal = false;

  editClubForm = {
    club_name: '',
    description: '',

    club_name_ar: '',
    description_ar: '',

    logo: null as File | null,
    logoPreview: '',
  };

  postForm = {
    content: '',
    image: null as File | null,
    imagePreview: '',
  };

  eventForm = {
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    location: '',
    date: '',
    max_attendees: 50,
    category: 'OTHER',
    image: null as File | null,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubService,
    private cdr: ChangeDetectorRef,
    private activitiesService: ActivitiesService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.clubId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clubId) {
      this.getClubDetails();
      this.getClubPosts();
      this.getClubActivities();
    }
  }

  getClubDetails() {
    this.clubService.getClubById(this.clubId).subscribe((data) => {
      console.log('CLUB DATA:', data);
      this.club = data;
      this.cdr.detectChanges();
    });
  }

  getClubPosts() {
    this.clubService.getPostsByClub(this.clubId).subscribe({
      next: (data) => {
        console.log('POSTS API:', data);
        this.posts = data;
      },
      error: (err) => {
        console.error('POSTS ERROR:', err);
      },
    });
  }

  getClubActivities() {
    this.clubService.getActivitiesByClub(this.clubId).subscribe((data) => {
      this.events = data;
      this.cdr.detectChanges();
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

  clubRequests() {
    this.clubService.getMyClubId().subscribe({
      next: (res) => {
        this.router.navigate(['dashboard/members', res.id]);
      },
      error: (err) => {
        console.error('Error fetching my club ID:', err);
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

  addItem(): void {
    this.isMenuOpen = false;
    alert('Add clicked');
  }

  shareClub(): void {
    this.isMenuOpen = false;
    navigator.clipboard.writeText(window.location.href);
    alert('Club link copied');
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

  goBack(): void {
    window.history.back();
  }

  createPost(): void {
    this.showCreatePostModal = true;
  }

  createEvent(): void {
    this.showCreateEventModal = true;
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

  close() {
    this.selectedActivity = null;
  }

  saveClubChanges() {
    const formData = new FormData();

    formData.append('club_name', this.editClubForm.club_name);
    formData.append('description', this.editClubForm.description);

    formData.append('club_name_ar', this.editClubForm.club_name_ar);
    formData.append('description_ar', this.editClubForm.description_ar);

    if (this.editClubForm.logo) {
      formData.append('logo', this.editClubForm.logo);
    }

    console.log(this.editClubForm);
    this.clubService.updateClub(this.clubId, formData).subscribe({
      next: (res) => {
        this.club = res;

        this.getClubDetails();

        this.closeEditClubModal();

        Swal.fire('Success', 'Club updated successfully', 'success');
      },

      error: (err) => {
        console.error(err);

        Swal.fire('Error', 'Update failed', 'error');
      },
    });
  }

  publishPost() {
    if (!this.postForm.content) return;
    this.clubService.createPost(this.clubId, this.postForm).subscribe({
      next: (res) => {
        this.closeCreatePostModal();
        this.getClubPosts();

        this.postForm = {
          content: '',
          image: null,
          imagePreview: '',
        };
        Swal.fire('Published', 'Post published successfully', 'success');
      },
      error: (err) => Swal.fire('Error', 'Failed to publish post', 'error'),
    });
  }

  submitEvent() {
    this.clubService.createActivity(this.clubId, this.eventForm).subscribe({
      next: (res) => {
        this.events.unshift(res);
        this.closeCreateEventModal();
        Swal.fire('Created', 'Event created successfully', 'success');
        this.closeCreateEventModal();
      },
      error: (err) => Swal.fire('Error', 'Failed to create event', 'error'),
    });
  }

  openEditClubModal() {
    this.showEditClubModal = true;

    this.editClubForm = {
      club_name: this.club?.club_name || '',
      description: this.club?.description || '',

      club_name_ar: this.club?.club_name_ar || '',
      description_ar: this.club?.description_ar || '',

      logo: null,
      logoPreview: this.club?.logo || '',
    };

    console.log(this.editClubForm);
  }

  closeEditClubModal() {
    this.showEditClubModal = false;
  }

  openCreatePostModal() {
    this.showCreatePostModal = true;
    this.isMenuOpen = false;
  }

  closeCreatePostModal() {
    this.showCreatePostModal = false;

    this.postForm = {
      content: '',
      image: null,
      imagePreview: '',
    };
  }

  openCreateEventModal() {
    this.showCreateEventModal = true;
    this.isMenuOpen = false;
  }

  closeCreateEventModal() {
    this.showCreateEventModal = false;
  }

  onClubLogoSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.editClubForm.logo = file;

      const reader = new FileReader();

      reader.onload = () => {
        this.editClubForm.logoPreview = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  onPostImageSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.postForm.image = file;

      const reader = new FileReader();

      reader.onload = () => {
        this.postForm.imagePreview = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  onEventImageSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.eventForm.image = file;
    }
  }

  viewParticipants(activityId: number) {
    this.router.navigate(['/dashboard/activities', activityId, 'participants']);
  }

  confirmDeleteActivity(activityId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteActivity(activityId);
      }
    });
  }

  deleteActivity(activityId: number) {
    this.clubService.deleteActivity(activityId).subscribe({
      next: () => {
        this.events = this.events.filter((e) => e.id !== activityId);
        Swal.fire('Deleted!', 'Activity has been deleted.', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'Could not delete the activity.', 'error');
      },
    });
  }
}
