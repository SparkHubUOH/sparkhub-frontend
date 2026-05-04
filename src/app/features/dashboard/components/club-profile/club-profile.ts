import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-club-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './club-profile.html',
  styleUrl: './club-profile.css'
})
export class ClubProfile {

  isLeader = true;
  isJoined = false;
  isNotified = false;
  isMenuOpen = false;
  showAllPosts = false;
  showAllEvents = false;

  posts = [
    { id: 1, date: 'DEC 2025', title: 'نسعد بمشاركتنا في الأسبوع العالمي للأعمال، حيث قدّم فريق...', liked: false },
    { id: 2, date: 'Nov 2025', title: 'اليوم الثاني من أسبوع ريادة الأعمال مع نادي الذكاء الاصطناعي!', liked: false },
    { id: 3, date: 'Nov 2025', title: 'أمن الحاسوب، نذّكر أن حماية بياناتنا هي حماية لذكائنا..', liked: false },
    { id: 4, date: 'Oct 2025', title: 'ورشة عمل جديدة قادمة قريباً...', liked: false },
  ];

  events = [
    { id: 1, title: 'Workshop on Introduction to AI', date: '14-11-2025', location: 'Fablab hall' },
    { id: 2, title: 'في يومنا الوطني.. نحتفل بماضٍ عظيم وحاضر ملهم', date: '24-9-2025', location: 'Aja College' },
    { id: 3, title: 'Workshop on Big Data Science and AI', date: '20-2-2025', location: 'Fablab hall' },
    { id: 4, title: 'Workshop on Software Development', date: '24-9-2025', location: 'Fablab hall' },
    { id: 5, title: 'AI Hackathon 2025', date: '10-1-2025', location: 'Main Hall' },
  ];

  get visiblePosts() {
    return this.showAllPosts ? this.posts : this.posts.slice(0, 3);
  }

  get visibleEvents() {
    return this.showAllEvents ? this.events : this.events.slice(0, 4);
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

  deleteClub(): void {
    this.isMenuOpen = false;

    if (confirm('Are you sure you want to delete this club?')) {
      alert('Club deleted');
    }
  }

  goBack(): void {
    window.history.back();
  }

  createPost(): void {
    alert('Create Post clicked');
  }

  createEvent(): void {
    alert('Create Event clicked');
  }

  readMore(post: any): void {
    alert(post.title);
  }

  toggleLike(post: any): void {
    post.liked = !post.liked;
  }

  copyPostLink(post: any): void {
    const link = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(link);
    alert('Post link copied');
  }

  registerEvent(event: any): void {
    alert(`Registered for: ${event.title}`);
  }

  viewEvent(event: any): void {
    alert(event.title);
  }
}