import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { ClubService } from '../../../../services/club-service/club-service';
import { ActivatedRoute } from '@angular/router';
import { Sidebar } from '../../sidebar/sidebar';

export interface Team {
  name: string;
  teamLeader: string;
  viceLeader: string;
  members: string[];
  editableMembers: string[];
  expanded: boolean;
}

export interface OrgChartResponse {
  clubLeader: string;
  clubViceLeader: string;
  teams: Team[];
}

@Component({
  selector: 'app-org-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, RouterLink, ProfileSidebar, Sidebar],
  templateUrl: './org-chart.html',
  styleUrl: './org-chart.css',
})
export class OrgChart {
  clubLeader = '';
  clubViceLeader = '';

  teams: Team[] = [];

  copied = false;
  isEditMode = false;
  isClubLeader = false;
  selectedTeam: Team | null = null;

  constructor(
    private clubService: ClubService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const idFromRoute = this.route.snapshot.paramMap.get('id');

    const clubId = idFromRoute ? Number(idFromRoute) : Number(localStorage.getItem('clubId'));

    if (!clubId) {
      console.error('No Club ID found');
      return;
    }

    this.clubService.getClubById(clubId).subscribe({
      next: (club: any) => {
        console.log('club', club);
        console.log('current user', currentUser);

        this.isClubLeader = Number(club.created_by) === Number(currentUser.id);

        console.log('isClubLeader', this.isClubLeader);

        this.loadOrgChart(clubId);
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  loadOrgChart(clubId: number): void {
    this.clubService.getOrgChart(clubId).subscribe({
      next: (data) => {
        console.log(data);

        this.clubLeader = data.clubLeader;
        this.clubViceLeader = data.clubViceLeader;

        this.teams = data.teams.map((team: Team) => ({
          ...team,
          editableMembers: team.members ? [...team.members] : [],
          expanded: false,
        }));

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error loading OrgChart:', err);
      },
    });
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  toggleTeam(team: Team): void {
    team.expanded = !team.expanded;
  }

  openModal(team: Team): void {
    this.selectedTeam = {
      ...team,
      editableMembers: [...team.members.map((m) => String(m)), '', '', ''],
    };
  }

  closeModal(): void {
    this.selectedTeam = null;
  }

  updateMember(index: number, value: string): void {
    if (!this.selectedTeam) return;

    const updated = [...this.selectedTeam.editableMembers];

    updated[index] = value;

    this.selectedTeam = {
      ...this.selectedTeam,
      editableMembers: updated,
    };
  }

  trackByIndex(index: number): number {
    return index;
  }

  saveTeam(): void {
    if (!this.selectedTeam) return;

    const original = this.teams.find((t) => t.name === this.selectedTeam!.name);

    if (original) {
      original.teamLeader = this.selectedTeam.teamLeader;
      original.viceLeader = this.selectedTeam.viceLeader;

      original.members = this.selectedTeam.editableMembers.filter((m) => m.trim() !== '');
    }

    this.closeModal();
  }

  removeMember(index: number): void {
    if (!this.selectedTeam) return;

    const updated = [...this.selectedTeam.editableMembers];

    updated.splice(index, 1);

    this.selectedTeam = {
      ...this.selectedTeam,
      editableMembers: updated,
    };
  }
}
