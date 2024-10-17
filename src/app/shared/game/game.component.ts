// src/app/shared/game/game.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() quarterId: string;
  quarterData: any;
  guesses: any = {};
  score: number | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.loadQuarter(this.quarterId);
    this.gameService.currentQuarter$.subscribe(data => {
      this.quarterData = data;
      if (data) {
        Object.keys(data).forEach(sampleKey => {
          this.guesses[sampleKey] = { mashbill: '', proof: 90, age: 5 };
        });
      }
    });
  }

  submitGuesses() {
    this.gameService.submitGuesses(this.guesses).subscribe(
      score => this.score = score,
      error => console.error('Error submitting guesses:', error)
    );
  }
}