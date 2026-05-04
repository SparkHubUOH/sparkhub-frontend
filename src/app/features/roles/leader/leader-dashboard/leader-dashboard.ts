import { Component } from '@angular/core';
import { StudentDashboard } from "../../student/student-dashboard/student-dashboard";
import { ProfileSidebar } from "../../profile-sidebar/profile-sidebar";

@Component({
  selector: 'app-leader-dashboard',
  imports: [StudentDashboard, ProfileSidebar],
  templateUrl: './leader-dashboard.html',
  styleUrl: './leader-dashboard.css',
})
export class LeaderDashboard {

}
