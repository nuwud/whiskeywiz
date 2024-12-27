import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Form } from '@angular/forms';
import { Chart, ChartConfiguration } from 'chart.js';
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
      </div>
    </div>
  `,
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('completionChart') completionChartRef: ElementRef;
  @ViewChild('scoreChart') scoreChartRef: ElementRef;
  @ViewChild('deviceChart') deviceChartRef: ElementRef;

  selectedPeriod: string = '7';
  charts: any = {};

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.initializeCharts();
    this.updatePeriod();
  }

  initializeCharts(): void {
    this.charts.completion = new Chart(this.completionChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
        datasets: [{
          label: 'Completion Rate',
          data: [],
          backgroundColor: '#FFD700'
        }]
      }
    });

    this.charts.score = new Chart(this.scoreChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
        datasets: [{
          label: 'Score Distribution',
          data: [],
          backgroundColor: '#DAA520'
        }]
      }
    });

    this.charts.device = new Chart(this.deviceChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Mobile', 'Desktop', 'Tablet'],
        datasets: [{
          label: 'Device Usage',
          data: [],
          backgroundColor: '#B8860B'
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

  updatePeriod(): void {
    // Logic to update the charts based on the selected period
  }
}