import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService, PlayerScore } from '../../services/firebase.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  @Input() quarterId: string = '';
  leaderboard: PlayerScore[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    if (this.quarterId) {
      this.loadLeaderboard();
    }
  }

  ngOnChanges() {
    if (this.quarterId) {
      this.loadLeaderboard();
    }
  }

  loadLeaderboard() {
    this.firebaseService.getLeaderboard(this.quarterId).subscribe({
      next: (scores) => {
        this.leaderboard = scores.sort((a, b) => b.score - a.score).slice(0, 10); // Top 10 scores
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
      }
    });
  }
}