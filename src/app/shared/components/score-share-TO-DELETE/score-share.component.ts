import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-share',
  templateUrl: './score-share.component.html',
  styleUrls: ['./score-share.component.scss']
})
export class ScoreShareComponent {
  @Input() score: number;
  @Input() quarter: string;
  @Input() sampleScores: number[];
  
  copied = false;

  generateShareText(): string {
    const text = `🥃 WhiskeyWiz ${this.quarter}\nScore: ${this.score}/100\n\n`;
    const sampleEmojis = this.sampleScores
      .map(s => s >= 20 ? '🟨' : s >= 10 ? '🟧' : '🟥')
      .join('');
    return text + sampleEmojis;
  }

  async copyToClipboard() {
    await navigator.clipboard.writeText(this.generateShareText());
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }
}