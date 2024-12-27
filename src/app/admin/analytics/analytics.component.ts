import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-analytics',
  template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <h2>Analytics Dashboard</h2>
        <select [(ngModel)]="selectedPeriod" (change)="updatePeriod()">
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
      </div>

      <div class="analytics-grid">
        <div class="analytics-card">
          <h3>Completion Rate</h3>
          <div class="chart-container">
            <canvas #completionChart></canvas>
          </div>
        </div>

        <div class="analytics-card">
          <h3>Score Distribution</h3>
          <div class="chart-container">
            <canvas #scoreChart></canvas>
          </div>
        </div>

        <div class="analytics-card">
          <h3>Device Usage</h3>
          <div class="chart-container">
            <canvas #deviceChart></canvas>
          </div>
        </div>

        <div class="analytics-card">
          <h3>Average Time per Sample</h3>
          <div class="chart-container">
            <canvas #timeChart></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('completionChart') private completionChartRef!: ElementRef;
  @ViewChild('scoreChart') private scoreChartRef!: ElementRef;
  @ViewChild('deviceChart') private deviceChartRef!: ElementRef;
  @ViewChild('timeChart') private timeChartRef!: ElementRef;

  selectedPeriod: number = 7;
  private charts: { [key: string]: Chart } = {};

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  updatePeriod() {
    this.loadAnalytics();
  }

  private loadAnalytics() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - this.selectedPeriod);

    this.firebaseService.getCollection('analytics')
      .pipe(
        map(sessions => sessions.filter(session => 
          new Date(session.startTime) >= startDate
        ))
      )
      .subscribe(data => {
        const metrics = this.processAnalyticsData(data);
        this.updateCharts(metrics);
      });
  }

  private initializeCharts() {
    this.charts.completion = new Chart(this.completionChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Completion Rate',
          data: [],
          borderColor: '#FFD700',
          tension: 0.1
        }]
      }
    });

    this.charts.score = new Chart(this.scoreChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Score Distribution',
          data: [],
          backgroundColor: '#FFD700'
        }]
      }
    });

    this.charts.device = new Chart(this.deviceChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            '#FFD700',
            '#DAA520',
            '#B8860B'
          ]
        }]
      }
    });

    this.charts.time = new Chart(this.timeChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
        datasets: [{
          label: 'Average Time (seconds)',
          data: [],
          backgroundColor: '#FFD700'
        }]
      }
    });

    const chartTheme = {
      backgroundColor: '#FFD700',
      borderColor: '#000000',
      pointBackgroundColor: '#000000',
      gridColor: 'rgba(0,0,0,0.1)'
    };
    
    // In initializeCharts():
    Chart.defaults.color = '#000000';
    Chart.defaults.font.family = 'Hermona';
  }

  private updateCharts(metrics: any) {
    Object.keys(this.charts).forEach(chartKey => {
      const chart = this.charts[chartKey];
      if (chart && metrics[chartKey]) {
        chart.data.labels = metrics[chartKey].labels;
        chart.data.datasets[0].data = metrics[chartKey].data;
        chart.update();
      }
    });
    
  }

  private processAnalyticsData(data: any[]) {
    return {
      completion: this.calculateDatewiseCompletion(data),
      score: this.calculateScoreDistribution(data),
      device: this.calculateDeviceUsage(data),
      time: this.calculateAverageSampleTimes(data)
    };
  }

  private calculateDatewiseCompletion(data: any[]) {
    // Group by date and calculate completion rate
    const dateGroups = data.reduce((acc, session) => {
      const date = new Date(session.startTime).toLocaleDateString();
      if (!acc[date]) acc[date] = { total: 0, completed: 0 };
      acc[date].total++;
      if (session.gameData?.endTime) acc[date].completed++;
      return acc;
    }, {});

    const dates = Object.keys(dateGroups).sort();
    return {
      labels: dates,
      data: dates.map(date => 
        (dateGroups[date].completed / dateGroups[date].total) * 100
      )
    };
  }

  private calculateScoreDistribution(data: any[]) {
    const ranges = ['0-50', '51-100', '101-150', '151-200', '201-250', '251-280'];
    const distribution = data.reduce((acc, session) => {
      const score = session.gameData?.totalScore || 0;
      const rangeIndex = Math.min(Math.floor(score / 50), ranges.length - 1);
      acc[rangeIndex] = (acc[rangeIndex] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: ranges,
      data: ranges.map((_, index) => distribution[index] || 0)
    };
  }

  private calculateDeviceUsage(data: any[]) {
    const devices = data.reduce((acc, session) => {
      const device = session.deviceInfo?.platform || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(devices),
      data: Object.values(devices)
    };
  }

  private calculateAverageSampleTimes(data: any[]) {
    const sampleTimes = data.reduce((acc, session) => {
      session.gameData?.guesses.forEach((guess: any, index: number) => {
        if (!acc[index]) acc[index] = [];
        acc[index].push(guess.timeTaken || 0);
      });
      return acc;
    }, {});

    return {
      labels: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
      data: Object.values(sampleTimes).map((times: any) => 
        times.reduce((sum: number, time: number) => sum + time, 0) / times.length / 1000
      )
    };
  }
}