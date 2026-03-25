import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'source-toggle',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './source-toggle.component.html',
})
export class SourceToggleComponent {
  @Input() activeTab: 'upload' | 'paste' = 'upload';
  @Output() tabChange = new EventEmitter<'upload' | 'paste'>();
}
