import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile {
  showAllPosts = false;
  showAllSkills = false;
  showAllCertificates = false;

  posts = [
    { id: 1, title: 'نسعد بمشاركتنا في الأسبوع العالمي للأعمال، حيث قدّم فريق...', date: 'DEC 2025' },
    { id: 2, title: 'اليوم الثاني من أسبوع ريادة الأعمال مع نادي الذكاء الاصطناعي...', date: 'Nov 2025' },
    { id: 3, title: 'أمن الحاسوب، نذكر أن حماية بياناتنا هي حماية لذكائنا...', date: 'Nov 2025' },
    { id: 4, title: 'ورشة جديدة في تطوير الواجهات وتجربة المستخدم...', date: 'Oct 2025' }
  ];

  skills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular', 'Git', 'Testing', 'UI/UX'];

  certificates = [
    { name: 'Software Testing Fundamentals', issuer: 'Udemy', date: 'Mar 2025' },
    { name: 'Introduction to Quality Assurance', issuer: 'Coursera', date: 'Jan 2025' },
    { name: 'Agile Foundations', issuer: 'LinkedIn Learning', date: 'Dec 2024' }
  ];

  get visiblePosts() {
    return this.showAllPosts ? this.posts : this.posts.slice(0, 3);
  }

  get visibleSkills() {
    return this.showAllSkills ? this.skills : this.skills.slice(0, 8);
  }

  get visibleCertificates() {
    return this.showAllCertificates ? this.certificates : this.certificates.slice(0, 3);
  }

  goBack(): void {
    window.history.back();
  }

  editProfile(): void {
    alert('Edit Profile clicked');
  }

  shareProfile(): void {
    navigator.clipboard.writeText(window.location.href);
    alert('Profile link copied');
  }

  readMore(post: any): void {
    alert(post.title);
  }
}