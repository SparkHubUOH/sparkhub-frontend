import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClubService } from '../../../../services/club-service/club-service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '../../../../services/translation/translation';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activity-participants',
  imports: [ProfileSidebar, RouterLink, CommonModule, TranslateModule],
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
    private translate: TranslateService,
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
      Swal.fire(
        this.translate.instant('ACTIVITY_PARTICIPANTS.EMPTY_TITLE'),
        this.translate.instant('ACTIVITY_PARTICIPANTS.NO_PARTICIPANTS_EXPORT'),
        'warning'
      );
      return;
    }
    const dataToExport = this.participants.map((p) => ({
      [this.translate.instant('ACTIVITY_PARTICIPANTS.STUDENT_NAME')]: p.name,
      [this.translate.instant('ACTIVITY_PARTICIPANTS.UNIVERSITY_ID')]: p.university_id,
      [this.translate.instant('ACTIVITY_PARTICIPANTS.ROLE')]: p.role,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    const sheetName = this.translate.instant('ACTIVITY_PARTICIPANTS.ATTENDANCE_LIST');
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileName = `${this.activityTitle}_${this.translate.instant('ACTIVITY_PARTICIPANTS.ATTENDANCE_FILE_SUFFIX')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    Swal.fire(
      this.translate.instant('ACTIVITY_PARTICIPANTS.SUCCESS_TITLE'),
      this.translate.instant('ACTIVITY_PARTICIPANTS.FILE_DOWNLOADED'),
      'success'
    );
  }

  removeParticipant(userId: number) {
    Swal.fire({
      title: this.translate.instant('ACTIVITY_PARTICIPANTS.CONFIRM_TITLE'),
      text: this.translate.instant('ACTIVITY_PARTICIPANTS.CONFIRM_TEXT'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: this.translate.instant('ACTIVITY_PARTICIPANTS.CONFIRM_BUTTON'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.clubService.removeParticipantFromActivity(this.activityId, userId).subscribe({
          next: () => {
            this.participants = this.participants.filter((p) => p.userId !== userId);
            Swal.fire(
              this.translate.instant('ACTIVITY_PARTICIPANTS.REMOVED_TITLE'),
              this.translate.instant('ACTIVITY_PARTICIPANTS.REMOVED_TEXT'),
              'success'
            );
          },
          error: () =>
            Swal.fire(
              this.translate.instant('ACTIVITY_PARTICIPANTS.ERROR_TITLE'),
              this.translate.instant('ACTIVITY_PARTICIPANTS.REMOVE_FAILED'),
              'error'
            ),
        });
      }
    });
  }
}
