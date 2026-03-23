import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-job-details-form',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './job-details-form.component.html'
})
export class JobDetailsFormComponent {
  @Input() jdText: string = '';
  @Output() jdTextChange = new EventEmitter<string>();

  @Input() roleText: string = '';
  @Output() roleTextChange = new EventEmitter<string>();
}
