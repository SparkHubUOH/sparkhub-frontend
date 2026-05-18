import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Profile {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.apiUrl}/profile/`);
  }

  updateProfile(data: any) {
    return this.http.put(`${this.apiUrl}/profile/details/`, data);
  }

  getPublicProfile(userId: string) {
    return this.http.get(`${this.apiUrl}/profile/${userId}/`);
  }

  getCertificatesByUser(id: string) {
    return this.http.get(`${this.apiUrl}/users/${id}/certificates`);
  }

  getSkillsByUser(id: string) {
    return this.http.get(`${this.apiUrl}/users/${id}/skills`);
  }

  getPostsByUser(id: string) {
    return this.http.get(`${this.apiUrl}/users/${id}/posts`);
  }

  getCertificates() {
    return this.http.get(`${this.apiUrl}/certificates/`);
  }

  deleteCertificate(id: number) {
    return this.http.delete(`${this.apiUrl}/certificates/${id}/`);
  }

  addCertificate(data: any) {
    return this.http.post(`${this.apiUrl}/certificates/`, data);
  }

  getSkills() {
    return this.http.get(`${this.apiUrl}/skills/`);
  }

  deleteSkill(id: number) {
    return this.http.delete(`${this.apiUrl}/skills/${id}/`);
  }

  addSkill(data: any) {
    return this.http.post(`${this.apiUrl}/skills/`, data);
  }

  getStudentPosts() {
    return this.http.get(`${this.apiUrl}/student-posts/`);
  }

  addPost(formData: FormData) {
    return this.http.post(`${this.apiUrl}/student-posts/`, formData);
  }
}
