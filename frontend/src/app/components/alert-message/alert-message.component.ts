import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'alert-message',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './alert-message.component.html'
})
export class AlertMessageComponent {
  @Input() message: string | null = null;
}
