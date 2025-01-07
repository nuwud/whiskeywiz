import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-quarter',
  template: `
    <div class="quarter-container" [class.embedded]="isEmbedded">
      <!-- Banner Mode -->
      <div *ngIf="isEmbedded && !isExpanded" class="banner-mode">
        <button (click)="expand()" class="expand-button">
          Play {{formatQuarterDisplay(quarterId)}} Game
        </button>
      </div>

      <!-- Game Mode -->
      <div *ngIf="!isEmbedded || isExpanded" class="game-mode">
        <app-game
          [quarterId]="quarterId"
          (gameComplete)="handleGameComplete($event)">
        </app-game>
      </div>
    </div>
  `,
  styles: [`
    .quarter-container {
      width: 100%;
      height: 100%;
    }

    .banner-mode {
      /* Banner styling */
    }

    .game-mode {
      /* Game styling */
    }
  `]
})
export class QuarterComponent implements OnInit {
  @Input() quarterId: string = '';
  @Input() isEmbedded: boolean = false;
  isExpanded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.isEmbedded) {
      this.route.params.subscribe(params => {
        const mmyy = params['mmyy'];
        if (mmyy && this.isValidMMYY(mmyy)) {
          this.quarterId = mmyy;
        } else {
          console.error('Invalid quarter format:', mmyy);
          this.router.navigate(['/quarters']);
        }
      });
    }
  }

  handleGameComplete(score: number) {
    console.log(`Game completed for quarter ${this.quarterId} with score ${score}`);
  }

  formatQuarterDisplay(mmyy: string): string {
    if (!mmyy || !this.isValidMMYY(mmyy)) return '';
    const month = parseInt(mmyy.substring(0, 2));
    const year = '20' + mmyy.substring(2, 4);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month - 1]} ${year}`;
  }

  isValidMMYY(mmyy: string): boolean {
    if (!mmyy || mmyy.length !== 4) return false;
    
    const month = parseInt(mmyy.substring(0, 2));
    if (month < 1 || month > 12) return false;

    const year = parseInt(mmyy.substring(2, 4));
    if (year < 20 || year > 99) return false;

    return true;
  }

  expand() {
    this.isExpanded = true;
  }
}