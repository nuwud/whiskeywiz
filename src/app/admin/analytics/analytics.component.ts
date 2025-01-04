// src/app/admin/analytics/analytics.component.ts

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { ChartData } from '../../shared/models/analytics.model';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild('completionChart') completionChartRef: ElementRef;
  @ViewChild('scoreChart') scoreChartRef: ElementRef;
  @ViewChild('deviceChart') deviceChartRef: ElementRef;
  @ViewChild('participationChart') participationChartRef: ElementRef;

  selectedPeriod: string = '7';
  private subscription: Subscription;
  private charts: { [key: string]: Chart } = {};

  constructor(private analyticsService: AnalyticsService) {
    // Set global Chart.js defaults
    Chart.defaults.color = '#FFD700';
    Chart.defaults.font.family = 'Hermona';
  }

  ngOnInit() {
    this.subscription = this.analyticsService.getAnalyticsData()
      .subscribe(data => {
        this.updateCharts(data);
      });

    this.analyticsService.fetchAnalyticsData();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    Object.values(this.charts).forEach(chart => chart.destroy());
  }

  updatePeriod(): void {
    this.analyticsService.fetchAnalyticsData(); // You might want to add period parameter here
  }

  private updateCharts(data: ChartData) {
    if (data.participationTrend) {
      this.updateParticipationChart(data.participationTrend);
    }
    if (data.participationTrend) {
      this.updateCompletionChart(data.participationTrend);
    }
    if (data.deviceStats) {
      this.updateDeviceChart(data.deviceStats);
    }
    if (data.accuracyStats) {
      this.updateAccuracyChart(data.accuracyStats);
    }
  }

  private updateParticipationChart(data: any[]) {
    if (!this.participationChartRef?.nativeElement) return;

    if (this.charts.participation) {
      this.charts.participation.destroy();
    }

    this.charts.participation = new Chart(this.participationChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.map(d => d.quarter),
        datasets: [
          {
            label: 'Participants',
            data: data.map(d => d.participants),
            borderColor: '#FFD700',
            tension: 0.1
          },
          {
            label: 'Average Score',
            data: data.map(d => d.avgScore),
            borderColor: '#82ca9d',
            tension: 0.1
          }
        ]
      },
      options: this.getChartOptions()
    });
  }

  private updateCompletionChart(data: any[]) {
    if (!this.completionChartRef?.nativeElement) return;

    if (this.charts.completion) {
      this.charts.completion.destroy();
    }

    this.charts.completion = new Chart(this.completionChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.quarter),
        datasets: [{
          label: 'Completion Rate',
          data: data.map(d => (d.completed / d.participants) * 100),
          backgroundColor: '#FFD700'
        }]
      },
      options: this.getChartOptions()
    });
  }

  private updateDeviceChart(data: any[]) {
    if (!this.deviceChartRef?.nativeElement) return;

    if (this.charts.device) {
      this.charts.device.destroy();
    }

    this.charts.device = new Chart(this.deviceChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.device),
        datasets: [{
          data: data.map(d => d.count),
          backgroundColor: [
            '#FFD700',
            '#82ca9d',
            '#8884d8',
            '#ffc658'
          ]
        }]
      },
      options: {
        ...this.getChartOptions(),
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#FFD700' }
          }
        }
      }
    });
  }

  private updateAccuracyChart(data: any[]) {
    if (!this.scoreChartRef?.nativeElement) return;
  
    if (this.charts.accuracy) {
      this.charts.accuracy.destroy();
    }
  
    this.charts.accuracy = new Chart(this.scoreChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.type),
        datasets: [{
          label: 'Accuracy %',
          data: data.map(d => d.accuracy),
          backgroundColor: '#FFD700'
        }]
      },
      options: {
        ...this.getChartOptions(),
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#FFD700' }
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: { color: '#FFD700' }
          }
        }
      }
    });
  }

  private getChartOptions() {
    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: { color: '#FFD700' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#FFD700' }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#FFD700' }
        }
      }
    };
  }
}