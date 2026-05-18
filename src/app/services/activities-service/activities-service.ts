import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRegisteredActivities() {
    return this.http.get<any[]>(`${this.apiUrl}/activities/my-activities/`);
  }

  registerForActivity(activityId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/activities/${activityId}/register/`, {});
  }
}
