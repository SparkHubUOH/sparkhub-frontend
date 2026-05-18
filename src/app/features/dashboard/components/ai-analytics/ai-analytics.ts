import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../../../services/analytics/analytics.service';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
} from 'chart.js';
import { RouterLink } from '@angular/router';

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

@Component({
  selector: 'app-ai-analytics',
  imports: [CommonModule, FormsModule, TranslateModule, ProfileSidebar, BaseChartDirective, RouterLink],
  templateUrl: './ai-analytics.html',
  styleUrl: './ai-analytics.css',
})
export class AiAnalytics implements OnInit {
  histCol = '';
  histBins = 10;
  dataFile = 'sample.csv';
  selectedTab = 'Overview';
  currentLang = 'en';

  columnsSelected: string[] = [];
  dataPreview: any[] = [];

  summary: any = null;
  predictionResults: any = null;
  clubStatistics: any = null;
  loading = false;

  clubStatsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Activities',
        borderRadius: 12,
        borderSkipped: false,
        barThickness: 58,
        backgroundColor: [
          '#3B82F6',
          '#6366F1',
          '#8B5CF6',
          '#06B6D4',
          '#14B8A6',
          '#10B981',
          '#F59E0B',
        ],
      },
    ],
  };

  clubChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: true,
        text: 'Club Activity Analytics',
        color: '#111827',
        font: {
          size: 18,
          weight: 'bold',
        },
      },

      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        cornerRadius: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },

      y: {
        beginAtZero: true,
        grace: '10%',

        grid: {
          color: 'rgba(203,213,225,0.35)',
        },

        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  histChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Histogram',
        backgroundColor: '#93c5fd',
        borderColor: '#3b82f6',
      },
    ],
  };

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    this.currentLang = this.translate.currentLang;

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.loadPreview();
    this.loadClubStatistics();
    this.cdr.detectChanges();
  }

  loadPreview(): void {
    this.loading = true;

    this.analyticsService.getDataPreview(this.dataFile, 50).subscribe({
      next: (res) => {
        console.log('RES:', res);

        this.dataPreview = res.rows;
        this.loading = false;

        if (this.dataPreview.length) {
          this.columnsSelected = Object.keys(this.dataPreview[0]);
        }
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  loadSummary(): void {
    this.loading = true;
    this.analyticsService.getSummaryStats(this.dataFile, this.columnsSelected).subscribe({
      next: (res) => {
        this.summary = res.stats;
        this.loading = false;
      },
      error: (_) => (this.loading = false),
    });
  }

  loadHistogram(): void {
    if (!this.histCol) return;
    this.loading = true;
    this.analyticsService.getHistogram(this.dataFile, this.histCol, this.histBins).subscribe({
      next: (res) => {
        const midLabels = [];
        for (let i = 0; i < res.bins.length - 1; i++) {
          const mid = (res.bins[i] + res.bins[i + 1]) / 2;
          midLabels.push(mid.toFixed(2));
        }
        this.histChartData = {
          labels: midLabels,
          datasets: [
            {
              data: res.counts,
              label: `Histogram of ${this.histCol}`,
              backgroundColor: '#93c5fd',
              borderColor: '#3b82f6',
            },
          ],
        };
        this.loading = false;
      },
      error: (_) => (this.loading = false),
    });
  }

  loadClubStatistics(): void {
    this.loading = true;

    this.analyticsService.getClubStatistics().subscribe({
      next: (res) => {
        console.log(res);

        this.clubStatistics = res;

        const clubs = res.clubs || [];

        this.clubStatsChartData = {
          labels: clubs.map((c: any) => c.club_name),

          datasets: [
            {
              data: clubs.map((c: any) => c.activities_count),

              label: 'Activities Per Club',

              borderRadius: 14,
              borderSkipped: false,
              barThickness: 42,

              backgroundColor: [
                '#3B82F6',
                '#6366F1',
                '#8B5CF6',
                '#06B6D4',
                '#14B8A6',
                '#10B981',
                '#F59E0B',
              ],

              hoverBackgroundColor: [
                '#2563EB',
                '#4F46E5',
                '#7C3AED',
                '#0891B2',
                '#0F766E',
                '#059669',
                '#D97706',
              ],
            },
          ],
        };

        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onColumnsChange(value: string): void {
    this.columnsSelected = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
  }

  runPrediction(): void {
    console.log('Prediction started');
  }
}
