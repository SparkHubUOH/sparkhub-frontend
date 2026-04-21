import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Auth } from '../../../../services/auth';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboard implements OnInit {
  currentLang = 'en';
  user: any = null;

  profileData = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    favoriteClubs: [
      {
        avatar: 'AI',
        name: 'AI Club',
        description: 'A student club interested in artificial intelligence concepts and smart technology applications.',
      },
      {
        avatar: 'FL',
        name: 'Fab Lab Club',
        description: 'A student club focused on digital innovation and technical creativity.',
      },
    ],
    activitiesAttended: [
      {
        title: 'Workshop on AI-Driven Software Development',
        date: '24-9-2025',
        location: 'FabLab hall',
        imageUrl: 'assets/images/activity1.jpg',
      },
      {
        title: 'Panel Discussion with Majed Al-Juraibi',
        date: '16-02-2026',
        location: 'Center Theater',
        imageUrl: 'assets/images/activity2.jpg',
      },
    ],
    certificates: [
      { title: 'CCNA', date: '4-09-2022', id: '08642768' },
      { title: 'CSDP', date: '23-08-2025', id: '3756470' },
      { title: 'PMP', date: '1-11-2025', id: '4708467' },
    ],
    skills: ['Problem-Solving', 'Critical Thinking', 'Continuous Learning', 'Teamwork', 'Python', 'SQL'],
  };

  constructor(private authService: Auth, private translate: TranslateService) {}

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    this.authService.userProfile$.subscribe((data) => {
      if (data) {
        this.user = data;
        this.profileData.firstName = data.firstName || data.first_name ;
        this.profileData.lastName = data.lastName || data.last_name ;
        this.profileData.email = data.email ;
        this.profileData.phoneNumber = data.phoneNumber || data.phone ;
        this.profileData.bio = data.bio || data.overview;
        this.profileData.favoriteClubs = data.favoriteClubs || data.favorite_clubs || this.profileData.favoriteClubs;
        this.profileData.activitiesAttended = data.activitiesAttended || data.activities_attended || this.profileData.activitiesAttended;
        this.profileData.certificates = data.certificates || this.profileData.certificates;
        this.profileData.skills = data.skills || this.profileData.skills;
      }
    });

    // Also fetch profile directly if not already loaded
    this.authService.getProfile().subscribe(
      (data) => {
        this.authService.setProfile(data);
      },
      (error) => console.error('Error fetching profile:', error)
    );
  }

  editProfile() {
    console.log('Edit profile clicked');
  }

  shareProfile() {
    console.log('Share profile clicked');
  }

  addNewCertificate() {
    console.log('Add new certificate clicked');
  }

  addNewSkill() {
    console.log('Add new skill clicked');
  }

  goBack() {
    window.history.back();
  }

  registerActivity(activity: any) {
    console.log('Register activity:', activity);
  }
}
