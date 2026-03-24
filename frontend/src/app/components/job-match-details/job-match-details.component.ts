import { Component, Input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'job-match-details',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './job-match-details.component.html',
})
export class JobMatchDetailsComponent {
  @Input() details: string = '';
}
