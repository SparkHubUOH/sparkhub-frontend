import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../sidebar/sidebar'
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '../../../../services/analytics/analytics.service';
import { ProfileSidebar } from "../../../roles/profile-sidebar/profile-sidebar";

@Component({
  selector: 'app-ai-analytics',
  imports: [CommonModule, FormsModule, TranslateModule, ProfileSidebar],
  templateUrl: './ai-analytics.html',
  styleUrl: './ai-analytics.css',
})
export class AiAnalytics {
  selectedTab: string = 'data';
  dataPreview: any[] = [];
  predictionResults: any;
  loading = false;
  constructor(private analyticsService: AnalyticsService) {}
  loadDataPreview(): void {
    this.loading = true;
    this.analyticsService.getDataPreview().subscribe({
      next: (data) => {
        this.dataPreview = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
  runPrediction(): void {
    this.loading = true;
    this.analyticsService.runForecast().subscribe({
      next: (res) => {
        this.predictionResults = res;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}
