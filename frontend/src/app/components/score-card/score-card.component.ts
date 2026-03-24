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
    if (s === null || s === undefined) return 'text-slate-400';
    return s >= 75 ? 'text-emerald-500' : (s >= 50 ? 'text-amber-500' : 'text-rose-500');
  }

  getBlobClasses(): string {
    switch (this.theme) {
      case 'brand':
        return '-right-6 -top-6 bg-brand-500/10 group-hover:bg-brand-500/20';
      case 'indigo':
        return '-left-6 -bottom-6 bg-indigo-500/10 group-hover:bg-indigo-500/20';
      case 'gradient':
        return 'inset-0 bg-gradient-to-br from-brand-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 w-full h-full';
      default:
        return '';
    }
  }
}
