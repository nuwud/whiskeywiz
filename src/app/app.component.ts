import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  template: `
          <router-outlet></router-outlet>
          <small class="version-indicator">Build: {{buildVersion}}</small>
  `,
  styles: [`
    .version-indicator {
          position: fixed;
          bottom: 5px;
          right: 5px;
          background: rgba(248, 249, 250, 0.1);
          padding: 5px;
          border-radius: 4px;
          font-size: 10px;
          z-index: 1000;
          color: #FFD700;
          opacity: 0.7;
        }
        .version-indicator:hover {
          opacity: 1;
        }
  `]
})
export class AppComponent {
  buildVersion: string;
  
  constructor() {
    const buildDate = new Date(environment.buildTimestamp || Date.now());
    this.buildVersion = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(buildDate) + ' PT';
  }
}