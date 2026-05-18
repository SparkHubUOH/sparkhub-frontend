import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDataPreview(file = 'sample.csv', limit = 50): Observable<{ rows: any[] }> {
    const params = new HttpParams().set('file', file).set('limit', limit);
    return this.http.get<{ rows: any[] }>(`${this.apiUrl}/analytics/data/preview/`, { params });
  }

  getSummaryStats(file = 'sample.csv', include?: string[]): Observable<{ stats: any }> {
    let params = new HttpParams().set('file', file);
    if (include?.length) include.forEach((v) => (params = params.append('include', v)));
    return this.http.get<{ stats: any }>(`${this.apiUrl}/analytics/data/summary/`, { params });
  }

  getGroupBy(
    file: string,
    by: string,
    agg_col?: string,
    agg_fn: 'count' | 'sum' | 'mean' = 'count',
  ): Observable<{ data: { [k: string]: any }[]; by: string; agg_col: string; agg_fn: string }> {
    let params = new HttpParams().set('file', file).set('by', by).set('agg_fn', agg_fn);
    if (agg_col) params = params.set('agg_col', agg_col);
    return this.http.get<any>(`${this.apiUrl}/analytics/data/groupby/`, { params });
  }

  getHistogram(
    file: string,
    col: string,
    bins = 10,
  ): Observable<{ counts: number[]; bins: number[] }> {
    const params = new HttpParams().set('file', file).set('col', col).set('bins', bins);
    return this.http.get<{ counts: number[]; bins: number[] }>(
      `${this.apiUrl}/analytics/data/histogram/`,
      { params },
    );
  }

  getClubStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/clubs/statistics/`);
  }
}
