import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService, UserSearchResult } from '../../../../services/staff-service/staff-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ClubService } from '../../../../services/club-service/club-service';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';

interface Member {
  memberId: number;
  role: string;
  name: string;
  university_id: string;
  userId: number;
}

@Component({
  selector: 'app-join-requests',
  imports: [CommonModule, NgClass, FormsModule, RouterLink, ProfileSidebar],
  templateUrl: './join-requests.html',
  styleUrl: './join-requests.css',
})
export class JoinRequests {
  clubId = 0;
  clubName = '';
  joinRequests: any[] = [];
  filteredRequests: any[] = [];
  searchUniversityId = '';

  constructor(
    private route: ActivatedRoute,
    private staffService: StaffService,
    private clubService: ClubService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.clubId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadClubInfo();
    this.loadJoinRequests();
  }

  loadClubInfo() {
    this.staffService.getClubInfo(this.clubId).subscribe({
      next: (club: any) => {
        this.clubName = club.club_name;
      },
    });
  }

  loadJoinRequests() {
    this.clubService.getJoinRequests(this.clubId).subscribe({
      next: (data: any[]) => {
        this.joinRequests = data.map((req) => ({
          id: req.id,
          full_name: req.full_name,
          university_id: req.university_id,
          userId: req.user.id,
          status: req.status,
        }));
        this.filteredRequests = [...this.joinRequests];
        this.cdr.detectChanges();
      },
    });
  }

  filterRequests() {
    const id = this.searchUniversityId.trim();
    this.filteredRequests =
      id.length === 0
        ? [...this.joinRequests]
        : this.joinRequests.filter((r) => r.university_id.includes(id));
  }

  approveRequest(req: any) {
    this.clubService.approveJoinRequest(this.clubId, req.id).subscribe({
      next: () => {
        Swal.fire('Approved', `${req.full_name} was approved.`, 'success');
        this.joinRequests = this.joinRequests.filter((r) => r.id !== req.id);
        this.filterRequests();
      },
    });
  }

  rejectRequest(req: any) {
    this.clubService.rejectJoinRequest(this.clubId, req.id).subscribe({
      next: () => {
        Swal.fire('Rejected', `${req.full_name} was removed from requests.`, 'info');
        this.joinRequests = this.joinRequests.filter((r) => r.id !== req.id);
        this.filterRequests();
      },
    });
  }
}
