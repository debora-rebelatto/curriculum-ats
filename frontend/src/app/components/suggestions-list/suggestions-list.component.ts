import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SuggestionCardComponent } from '../suggestion-card/suggestion-card.component';
import { Suggestion } from '../suggestion-card/suggestion.types';

@Component({
  selector: 'suggestions-list',
  standalone: true,
  imports: [TranslatePipe, SuggestionCardComponent],
  templateUrl: './suggestions-list.component.html',
})
export class SuggestionsListComponent {
  @Input({ required: true }) suggestions!: Suggestion[];
}
