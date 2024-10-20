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
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.firebaseService.getLeaderboard(this.quarterId).subscribe(
      scores => this.leaderboard = scores,
      error => console.error('Error loading leaderboard:', error)
    );
  }
}