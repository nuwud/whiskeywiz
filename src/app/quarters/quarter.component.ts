import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quarter',
  template: `
    <div class="quarter-container">
      <whiskey-wiz-game [quarter]="quarterId"></whiskey-wiz-game>
    </div>
  `,
  styles: [`
    .quarter-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class QuarterComponent implements OnInit {
  @Input() quarterId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.quarterId = params['id'];
      }
    });
  }
}