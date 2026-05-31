import { ChangeDetectorRef, Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../../../services/analytics/analytics.service';
import { ProfileSidebar } from '../../../roles/profile-sidebar/profile-sidebar';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  Chart,
  DoughnutController,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { RouterLink } from '@angular/router';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
);

@Component({
  selector: 'app-ai-analytics',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ProfileSidebar,
    BaseChartDirective,
    RouterLink,
  ],
  templateUrl: './ai-analytics.html',
  styleUrl: './ai-analytics.css',
})
export class AiAnalytics implements OnInit {
  histCol = '';
  histBins = 10;
  dataFile = 'sample.csv';
  selectedTab = 'overview';
  currentLang = 'en';
  loading = false;
  hasPredicted = false;

  columnsSelected: string[] = [];
  dataPreview: any[] = [];

  predictionForm = {
    category: 'WORKSHOPS',
    max_attendees: 50,
    club_activities_count: 5,
    avg_club_attendance: 20,
  };

  predictionResult: any = null;
  summary: any = null;
  predictionResults: any = null;
  clubStatistics: any = null;
  studentStatistics: any = null;
  activityStatistics: any = null;

  clubMembersChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [],
  };

  clubScoreChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

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

  studentEngagementChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  studentPointsChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [],
  };

  activityParticipantsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
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
    this.loadStudentStatistics();
    this.loadActivityStatistics();
    this.resetForm();
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

        this.clubScoreChartData = {
          labels: clubs.map((c: any) => c.club_name),

          datasets: [
            {
              data: clubs.map((c: any) => c.club_score),

              label: 'Club Score',

              borderRadius: 10,
              barThickness: 100,

              backgroundColor: ['#10B981', '#F59E0B', '#2563EB', '#7C3AED', '#0EA5E9'],
            },
          ],
        };

        this.clubMembersChartData = {
          labels: clubs.map((c: any) => c.club_name),

          datasets: [
            {
              data: clubs.map((c: any) => c.members_count),

              label: 'Members',

              backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],

              borderWidth: 2,
              borderColor: '#ffffff',
              borderRadius: 4,
              spacing: 2,
              hoverOffset: 15,
            },
          ],
        };

        this.cdr.detectChanges();
        this.loading = false;
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  loadStudentStatistics(): void {
    this.analyticsService.getStudentStatistics().subscribe({
      next: (res) => {
        console.log(res);

        this.studentStatistics = res;

        const students = res.top_students || [];

        this.studentEngagementChartData = {
          labels: students.map((s: any) => s.name),

          datasets: [
            {
              data: students.map((s: any) => s.engagement_score),
              label: 'Engagement Score',
              borderRadius: 12,
              backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
            },
          ],
        };

        this.studentPointsChartData = {
          labels: students.map((s: any) => s.name),

          datasets: [
            {
              data: students.map((s: any) => s.points),

              label: 'Points',

              backgroundColor: ['#F43F5E', '#FB923C', '#FACC15', '#2DD4BF', '#A855F7'],
              borderWidth: 2,
              borderColor: '#ffffff',
              borderRadius: 4,
              spacing: 2,
              hoverOffset: 15,
            },
          ],
        };
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  loadActivityStatistics(): void {
    this.analyticsService.getActivityStatistics().subscribe({
      next: (res) => {
        console.log(res);

        this.activityStatistics = res;

        const activities = res.top_activities || [];

        this.activityParticipantsChartData = {
          labels: activities.map((a: any) => a.title),

          datasets: [
            {
              data: activities.map((a: any) => a.participants_count),

              label: 'Participants',

              borderRadius: 12,

              backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'],
            },
          ],
        };

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  runPrediction(): void {
    
    this.loading = true;
    this.hasPredicted = false;
    this.predictionResult = null;

    this.analyticsService.predictActivity(this.predictionForm).subscribe({
      next: (res) => {
        console.log(res);
        this.predictionResult = res;
        this.hasPredicted = true;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  resetForm() {
    this.predictionResult = null;
    this.hasPredicted = false;
  }

  onColumnsChange(value: string): void {
    this.columnsSelected = value
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v);
  }

  clubMembersChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: 'bottom',

        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',

          font: {
            size: 13,
          },
        },
      },

      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        cornerRadius: 12,
      },
    },

    cutout: '68%',
  };

  studentPointsChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 20,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => ` Points: ${context.formattedValue}`,
        },
      },
    },
    cutout: '70%',
  };
}
