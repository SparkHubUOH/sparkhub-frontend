import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { ProfileSidebar } from "../../../roles/profile-sidebar/profile-sidebar";

export interface Team {
  name: string;
  teamLeader: string;
  viceLeader: string;
  members: string[];
  editableMembers: string[];
  expanded: boolean;
}

@Component({
  selector: 'app-org-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, RouterLink, ProfileSidebar],
  templateUrl: './org-chart.html',
  styleUrl: './org-chart.css'
})
export class OrgChart {

copied = false;

copyLink(): void {
  navigator.clipboard.writeText(window.location.href).then(() => {
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  });
}

isEditMode = false;
selectedTeam: Team | null = null;

  teams: Team[] = [
    { name: 'Events', teamLeader: 'عبدالله السويلم', viceLeader: 'أمل الشهراني', members: ['ريف عبدالكريم', 'زيد الجباري', 'حياة فاهم'], editableMembers: [], expanded: false },
    { name: 'Management', teamLeader: 'غادة التميمي', viceLeader: 'مشاري الحيص', members: ['سلمان الهديرس', 'شوق القنون', 'رهف الحيص'], editableMembers: [], expanded: false },
    { name: 'Content', teamLeader: 'سلمان الهديرس', viceLeader: 'أسيل الشمري', members: ['ماهر الحربي', 'محمد الشمري', 'غالية القريشي'], editableMembers: [], expanded: false },
    { name: 'Projects', teamLeader: 'عبدالله المطرود', viceLeader: 'نورة المحيمل', members: ['حسناء العقلاء', 'طيف البكر', 'فهد السيف'], editableMembers: [], expanded: false },
    { name: 'Media', teamLeader: 'سلمان الشمري', viceLeader: 'وسن الخوير', members: ['عمر الشمري', 'نورة الشلاقي', 'ريانة المطلق'], editableMembers: [], expanded: false },
    { name: 'Design', teamLeader: 'شوق القنون', viceLeader: 'شذا الزغيبي', members: ['الاء الهديرس', 'جود الجديعي', 'شيهانه الأحمري'], editableMembers: [], expanded: false }
  ];


  toggleEdit(): void { this.isEditMode = !this.isEditMode; }

  toggleTeam(team: Team): void { team.expanded = !team.expanded; }

  openModal(team: Team): void {
    this.selectedTeam = {
      ...team,
      teamLeader: team.teamLeader,
      viceLeader: team.viceLeader,
      editableMembers: [...team.members.map(m => String(m)), '', '', '']
    };
  }

  closeModal(): void { this.selectedTeam = null; }

  updateMember(index: number, value: string): void {
    if (!this.selectedTeam) return;
    const updated = [...this.selectedTeam.editableMembers];
    updated[index] = value;
    this.selectedTeam = { ...this.selectedTeam, editableMembers: updated };
  }

  trackByIndex(index: number): number { return index; }

  saveTeam(): void {
    if (!this.selectedTeam) return;
    const original = this.teams.find(t => t.name === this.selectedTeam!.name);
    if (original) {
      original.teamLeader = this.selectedTeam.teamLeader;
      original.viceLeader = this.selectedTeam.viceLeader;
      original.members = this.selectedTeam.editableMembers.filter(m => m.trim() !== '');
    }
    this.closeModal();
  }

  removeMember(index: number): void {
    if (!this.selectedTeam) return;
    const updated = [...this.selectedTeam.editableMembers];
    updated.splice(index, 1);
    this.selectedTeam = { ...this.selectedTeam, editableMembers: updated };
  }
  
}