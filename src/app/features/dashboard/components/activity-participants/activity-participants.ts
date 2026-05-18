import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClubService } from '../../../../services/club-service/club-service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activity-participants',
  imports: [ProfileSidebar, RouterLink, CommonModule],
  templateUrl: './activity-participants.html',
  styleUrl: './activity-participants.css',
})
export class ActivityParticipants implements OnInit {
  activityId!: number;
  activityTitle: string = '';
  participants: any[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubService,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.activityId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadParticipants();
  }

  loadParticipants() {
    this.clubService.getActivityParticipants(this.activityId).subscribe({
      next: (res) => {
        this.activityTitle = res.activity_title;
        this.participants = res.participants;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading participants', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goBack() {
    this.location.back();
  }

  exportToExcel() {
    if (this.participants.length === 0) {
      Swal.fire('Empty', 'No participants to export', 'warning');
      return;
    }
    const dataToExport = this.participants.map((p) => ({
      'Student Name': p.name,
      'University ID': p.university_id,
      Role: p.role,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance List');

    XLSX.writeFile(workbook, `${this.activityTitle}_Attendance.xlsx`);

    Swal.fire('Success', 'File downloaded successfully', 'success');
  }

  removeParticipant(userId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be removed from the activity list!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, remove them!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clubService.removeParticipantFromActivity(this.activityId, userId).subscribe({
          next: () => {
            this.participants = this.participants.filter((p) => p.userId !== userId);
            Swal.fire('Removed!', 'User has been removed from activity.', 'success');
          },
          error: () => Swal.fire('Error', 'Failed to remove user', 'error'),
        });
      }
    });
  }
}
