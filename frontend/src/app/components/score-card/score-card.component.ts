import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'score-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-card.component.html'
})
export class ScoreCardComponent {
  @Input() title: string = '';
  @Input() score: number | null | undefined = null;
  @Input() theme: 'brand' | 'indigo' | 'gradient' = 'brand';

  getScoreColor(s: number | null | undefined): string {
    if (s === null || s === undefined) return 'text-app-text3';
    return s >= 75 ? 'text-mint' : (s >= 50 ? 'text-gold' : 'text-ruby');
  }

  getBlobClasses(): string {
    switch (this.theme) {
      case 'brand':
        return '-right-6 -top-6 bg-gold/10 group-hover:bg-gold/20';
      case 'indigo':
        return '-left-6 -bottom-6 bg-mint/10 group-hover:bg-mint/20';
      case 'gradient':
        return 'inset-0 bg-gradient-to-br from-gold/5 to-mint/5 opacity-0 group-hover:opacity-100 w-full h-full';
      default:
        return '';
    }
  }
}
