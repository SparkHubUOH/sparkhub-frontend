import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { StaffService, UserSearchResult } from '../../../../services/staff-service/staff-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { ClubService } from '../../../../services/club-service/club-service';

interface Member {
  memberId: number;
  role: string;
  name: string;
  university_id: string;
  userId: number;
}

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, RouterLink, ProfileSidebar],
  templateUrl: './members.html',
  styleUrl: './members.css',
})
export class Members {
  copied = false;
  showTeamLeaders = true;
  showVice = false;
  showMembers = false;
  isSearching = false;
  isPromoting = false;
  searchCompleted = false;
  loggedInUserId = 0;
  clubId: number = 0;
  searchUniversityId = '';
  clubName = '';
  foundUser: UserSearchResult | null = null;

  members: Member[] = [];
  allMembers: any[] = [];

  showAssignModal = false;
  showDeleteModal = false;

  selectedMemberId: number | null = null;
  selectedFromRole = '';
  selectedMemberName = '';
  selectedToRole = 'Team Leader';
  selectedTeam = 'media';

  teamsList = [
    { value: 'events', label: 'Events' },
    { value: 'media', label: 'Media' },
    { value: 'design', label: 'Design' },
    { value: 'projects', label: 'Projects' },
    { value: 'content', label: 'Content' },
    { value: 'management', label: 'Management' },
    { value: 'technical', label: 'Technical' },
    { value: 'organization', label: 'Organization' },
  ];

  formatRole(role: string): string {
    switch (role.toLowerCase()) {
      case 'team leader':
        return 'Team Leader';
      case 'vice leader':
        return 'Vice Leader';
      case 'club leader':
        return 'Club Leader';
      default:
        return 'Member';
    }
  }

  constructor(
    private staffService: StaffService,
    private clubService: ClubService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.loggedInUserId = user.id;
    this.clubId = Number(this.route.snapshot.paramMap.get('id'));
    this.cdr.detectChanges();

    this.staffService.getClubInfo(this.clubId).subscribe({
      next: (club: any) => {
        this.clubName = club.club_name;
        this.cdr.detectChanges();
      },
    });

    const routeClubId = this.route.snapshot.paramMap.get('id');
    if (routeClubId) {
      this.clubId = Number(routeClubId);
    }

    if (!this.clubId && user.created_club?.id) {
      this.clubId = user.created_club.id;
    }

    if (!this.clubId) {
      console.error('No club available for this user');
      return;
    }

    this.loadMembers();
  }

  loadMembers() {
    this.staffService.getClubMembers(this.clubId).subscribe({
      next: (data: any[]) => {
        console.log('Data received from Django:', data);

        if (data && data.length > 0) {
          this.members = data.map((m: any) => ({
            memberId: m.id,
            role: m.role || 'Member',
            name: m.full_name || 'No Name',
            university_id: m.university_id,
            userId: m.user,
          }));

          this.allMembers = [...this.members];

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Failed to load members', err);
      },
    });
  }

  get normalMembers() {
    return this.members.filter(
      (m) => m.role.toLowerCase() !== 'club leader' && m.role.toLowerCase() !== 'vice leader',
    );
  }

  searchMemberById() {
    if (this.searchUniversityId.trim().length !== 9) {
      this.foundUser = null;
      this.searchCompleted = false;
      return;
    }

    this.isSearching = true;

    this.staffService.searchByUniversityId(this.searchUniversityId).subscribe({
      next: (user) => {
        this.foundUser = user;
        this.isSearching = false;
        this.searchCompleted = true;
      },

      error: () => {
        this.foundUser = null;
        this.isSearching = false;
        this.searchCompleted = true;
      },
    });
  }

  promoteToMember(user: UserSearchResult) {
    this.isPromoting = true;

    if (!user) return;

    this.staffService.addMemberToClub(this.clubId, user.id).subscribe({
      next: () => {
        this.isPromoting = false;

        Swal.fire('Success!', `${user.full_name} added as member`, 'success');

        this.loadMembers();

        this.foundUser = null;
        this.searchUniversityId = '';
        this.searchCompleted = false;
      },

      error: () => {
        this.isPromoting = false;

        Swal.fire('Error', 'Unable to add member', 'error');
      },
    });
  }

  openAssignModal(member: Member): void {
    this.selectedMemberName = member.name;
    this.selectedFromRole = member.role;
    this.selectedToRole = member.role;

    this.selectedMemberId = member.memberId;

    this.showAssignModal = true;
  }

  closeAssignModal() {
    this.showAssignModal = false;
  }

  removeMember() {
    const memberToDelete = this.members.find((m) => m.name === this.selectedMemberName);

    if (memberToDelete && memberToDelete.memberId) {
      this.clubService.deleteMember(memberToDelete.memberId).subscribe({
        next: () => {
          this.members = this.members.filter((m) => m.memberId !== memberToDelete.memberId);

          Swal.fire({
            title: 'Deleted!',
            text: `Member "${this.selectedMemberName}" has been removed.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            toast: true,
            position: 'top-end',
          });

          this.showDeleteModal = false;
        },
        error: (err) => {
          console.error('Django Backend Error:', err);

          Swal.fire({
            title: 'Error!',
            text: 'Could not delete the member. Please try again.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
        },
      });
    }
  }

  trackByFn(index: number, item: Member) {
    return item.memberId;
  }

  saveAssignedRole() {
    if (this.selectedMemberId) {
      const teamValue = this.selectedTeam === 'null' || !this.selectedTeam ? '' : this.selectedTeam;
      this.clubService
        .updateMemberRole(this.selectedMemberId, this.selectedToRole, teamValue)
        .subscribe({
          next: (res) => {
            this.closeAssignModal();
            Swal.fire('Updated!', 'The role and team have been updated successfully', 'success');
            this.loadMembers();
            this.closeAssignModal();
          },

          error: (err) => {
            console.log(err);
            Swal.fire('Error', 'Failed to update role and team', 'error');
          },
        });
    }
  }

  openDeleteModal(member: Member): void {
    this.selectedMemberName = member.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.members = this.members.filter((m) => m.name !== this.selectedMemberName);
    this.closeDeleteModal();
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
