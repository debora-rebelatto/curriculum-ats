import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-strengths-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './strengths-list.component.html',
})
export class StrengthsListComponent {
  @Input() strengths: string[] = [];
}
