import { Component, Input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'loading-spinner',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './loading-spinner.component.html'
})
export class LoadingSpinnerComponent {
  @Input() messageIndex: number = 0;
}
