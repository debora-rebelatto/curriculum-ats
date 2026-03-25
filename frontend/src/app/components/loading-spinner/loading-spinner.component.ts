import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'loading-spinner',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './loading-spinner.component.html',
})
export class LoadingSpinnerComponent {
  messageIndex = signal(1);
}
