import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDataPreview(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/analytics/data-preview/`);
  }

  runForecast(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/analytics/predict/`);
  }
}
