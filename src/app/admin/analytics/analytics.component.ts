import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild('completionChart') completionChartRef!: ElementRef;
  @ViewChild('scoreChart') scoreChartRef!: ElementRef;
  @ViewChild('deviceChart') deviceChartRef!: ElementRef;
  @ViewChild('participationChart') participationChartRef!: ElementRef;

  selectedPeriod: string = '30'; // Default to 30 days
  private charts: Record<string, Chart> = {};
  private subscription: Subscription = new Subscription();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadCharts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    Object.values(this.charts).forEach(chart => chart.destroy());
  }

  updatePeriod() {
    this.loadCharts(); // Reload charts with new period
  }

  private async loadCharts() {
    const data = await this.analyticsService.getAnalyticsData();
    if (!data) return;

    this.createParticipationChart(data.participation);
    this.createCompletionChart(data.participation);
    this.createDeviceChart(data.devices);
    this.createAccuracyChart(data.accuracy);
  }

  private createParticipationChart(data: any) {
    if (this.charts['participation']) {
      this.charts['participation'].destroy();
    }

    this.charts['participation'] = new Chart(this.participationChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((d: any) => d.quarter),
        datasets: [{
          label: 'Players per Quarter',
          data: data.map((d: any) => d.players),
          borderColor: '#FFD700'
        }]
      }
    });
  }

  // Add additional chart creation methods as placeholders
  private createCompletionChart(data: any) {}
  private createDeviceChart(data: any) {}
  private createAccuracyChart(data: any) {}
}