import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-text-paste',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './text-paste.component.html',
})
export class TextPasteComponent {
  @Input() resumeText: string = '';
  @Output() resumeTextChange = new EventEmitter<string>();
}
