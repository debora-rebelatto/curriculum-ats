import { Component, Input } from '@angular/core';
import { Suggestion, PRIORITY_CONFIG } from './suggestion.types';
import { SuggestionExampleComponent } from '../suggestion-example/suggestion-example.component';

@Component({
	selector: 'app-suggestion-card',
	standalone: true,
	imports: [SuggestionExampleComponent],
	templateUrl: './suggestion-card.component.html',
})
export class SuggestionCardComponent {
	@Input({ required: true }) suggestion!: Suggestion;

	get config() {
		return PRIORITY_CONFIG[this.suggestion.priority];
	}
}