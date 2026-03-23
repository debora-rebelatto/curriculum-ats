import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-action-suggestions',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './action-suggestions.component.html',
})
export class ActionSuggestionsComponent {
  @Input() suggestions: { priority: string; title: string; body: string }[] = [];
}
