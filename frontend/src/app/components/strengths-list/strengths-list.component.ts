import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-strengths-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './strengths-list.component.html',
})
export class StrengthsListComponent {
  @Input() strengths: string[] = [];
}
