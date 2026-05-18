import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserSearchResult {
  id: number;
  university_id: string;
  full_name: string;
  email: string;
  role: string;
}
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  changePassword(payload: ChangePasswordPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/change-password/`, payload);
  }

  searchUserByUniversityId(universityId: string): Observable<UserSearchResult> {
    return this.http.get<UserSearchResult>(`${this.apiUrl}/staff/search-user/`, {
      params: { university_id: universityId },
    });
  }

  promoteToLeader(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/staff/promote-to-leader/`, { user_id: userId });
  }

  getClubMembers(clubId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/clubs/${clubId}/members/`);
  }

  searchByUniversityId(id: string) {
    return this.http.get<UserSearchResult>(`${this.apiUrl}/users/search/?university_id=${id}`);
  }

  addMemberToClub(clubId: number, userId: number) {
    return this.http.post(`${this.apiUrl}/clubs/${clubId}/add-member/`, {
      user_id: userId,
    });
  }

  updateMemberRole(memberId: number, role: string) {
    return this.http.patch(`${this.apiUrl}/clubs/update-member-role/${memberId}/`, {
      role: role,
    });
  }

  getClubInfo(clubId: number) {
    return this.http.get(`${this.apiUrl}/clubs/${clubId}/`);
  }
}
