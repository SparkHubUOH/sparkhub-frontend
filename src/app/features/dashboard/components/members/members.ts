import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Member {
  role: string;
  name: string;
}

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule],
  templateUrl: './members.html',
  styleUrl: './members.css'
})
export class Members {
  copied = false;
showTeamLeaders=true;
showVice=false;
showMembers=false;
  members: Member[] = [
    { role: 'Club Leader', name: 'غادة التميمي' },
    { role: 'Vice Leader', name: 'مشاري الحيص' },
    { role: 'Team Leader', name: 'عبدالله السويلم' },
    { role: 'Team Leader', name: 'غادة التميمي' },
    { role: 'Team Leader', name: 'سلمان الهديرس' },
    { role: 'Team Leader', name: 'عبدالله المطرود' },
    { role: 'Team Leader', name: 'شوق القنون' },
    { role: 'Team Leader', name: 'سلمان الشمري' },
    { role: 'Vice Leader', name: 'أمل الشهراني' },
    { role: 'Vice Leader', name: 'مشاري الحيص' },
    { role: 'Vice Leader', name: 'أسيل الشمري' },
    { role: 'Vice Leader', name: 'نورة المحيمل' },
    { role: 'Vice Leader', name: 'شذا الزغيبي' },
    { role: 'Vice Leader', name: 'وسن الخوير' },
    { role: 'Member', name: 'شيهانة الأحمري' },
    { role: 'Member', name: 'محمد الشمري' }
  ];

  showAssignModal = false;
  showDeleteModal = false;

  selectedMemberName = 'Member';
  selectedFromRole = 'Member';
  selectedToRole = 'Team Leader';

  openAssignModal(member: Member): void {
    this.selectedMemberName = member.name;
    this.selectedFromRole = member.role;
    this.selectedToRole = member.role;
    this.showAssignModal = true;
  }

  removeMember() {
this.members = this.members.filter(
m => m.name !== this.selectedMemberName
);

this.showDeleteModal = false;
}
  closeAssignModal(): void {
    this.showAssignModal = false;
  }

  saveAssignedRole(): void {
    const member = this.members.find(m => m.name === this.selectedMemberName);
    if (member) {
      member.role = this.selectedToRole;
    }
    this.closeAssignModal();
  }

  openDeleteModal(member: Member): void {
    this.selectedMemberName = member.name;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.members = this.members.filter(m => m.name !== this.selectedMemberName);
    this.closeDeleteModal();
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  viewJoinRequests(): void {
    alert('Join requests page will be linked here.');
  }

  editMember(member: Member): void {
    alert(`Edit member: ${member.name}`);
  }

  messageMember(member: Member): void {
    alert(`Message member: ${member.name}`);
  }

  viewProfile(member: Member): void {
    alert(`View profile: ${member.name}`);
  }
  
}