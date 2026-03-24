import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'suggestion-example',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './suggestion-example.component.html',
})
export class SuggestionExampleComponent {
  @Input({ required: true }) example!: string;
}
