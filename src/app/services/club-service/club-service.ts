import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrgChartResponse } from '../../features/dashboard/components/org-chart/org-chart';

@Injectable({
  providedIn: 'root',
})
export class ClubService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClubById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clubs/${id}/`);
  }

  getMyClubId(): Observable<{ id: number }> {
    return this.http.get<{ id: number }>(`${this.apiUrl}/clubs/my-club/`);
  }

  getPostsByClub(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clubs/${id}/posts/`);
  }

  getActivitiesByClub(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clubs/${id}/activities/`);
  }

  getAllActivities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activities/all/`);
  }

  registerInActivity(activityId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/activities/${activityId}/register/`, {});
  }

  joinClub(clubId: number) {
    return this.http.post(`${this.apiUrl}/clubs/${clubId}/join/`, {});
  }

  getJoinRequests(clubId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/clubs/${clubId}/join-requests/`);
  }

  approveJoinRequest(clubId: number, memberId: number) {
    return this.http.patch(`${this.apiUrl}/clubs/${memberId}/manage/`, {
      action: 'accept',
    });
  }

  rejectJoinRequest(clubId: number, memberId: number) {
    return this.http.patch(`${this.apiUrl}/clubs/${memberId}/manage/`, {
      action: 'reject',
    });
  }

  getOrgChart(clubId: number): Observable<OrgChartResponse> {
    return this.http.get<OrgChartResponse>(`${this.apiUrl}/clubs/${clubId}/org-chart/`);
  }

  updateMemberRole(memberId: number, role: string, team: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-member-role/`, {
      member_id: memberId,
      role: role,
      team: team,
    });
  }

  deleteMember(memberId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/members/${memberId}/`);
  }

  updateClub(id: number, formData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/clubs/${id}/`, formData);
  }

  createPost(clubId: number, data: any): Observable<any> {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('club', clubId.toString());
    if (data.image) formData.append('image', data.image);
    return this.http.post(`${this.apiUrl}/clubs/${clubId}/posts/create/`, formData);
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${postId}/delete/`);
  }

  createActivity(clubId: number, data: any): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null) formData.append(key, data[key]);
    });
    formData.append('club', clubId.toString());
    return this.http.post(`${this.apiUrl}/clubs/${clubId}/activities/`, formData);
  }

  deleteActivity(activityId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/activities/${activityId}/delete/`);
  }

  getActivityParticipants(activityId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/activities/${activityId}/participants/`);
  }

  removeParticipantFromActivity(activityId: number, userId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/activities/${activityId}/participants/${userId}/remove/`,
    );
  }
}
